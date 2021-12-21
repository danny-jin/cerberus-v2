import { BigNumber, BigNumberish, ethers } from 'ethers';
import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';

import {
  IApproveBondAsyncThunk,
  IBondAssetAsyncThunk,
  ICalcBondDetailsAsyncThunk,
  IJsonRPCError,
  IRedeemBondAsyncThunk,
} from '../../interfaces/base';
import { IBondDetails } from '../../lib/bond';
import { RootState } from '../store';
import { calculateUserBondDetails, getBalances } from './accountSlice';
import { loadMarketPrice } from './appSlice';
import { error, info } from './messageSlice';
import { clearPendingTx, fetchPendingTxs } from './pendingTxSlice';
import { getSpecialBondCalculatorContract } from '../../utils/bond'
import { getDogPrice, getEthPrice, getFlokiPrice, getShibPrice } from '../../utils/price';
import { addressGroup } from '../../data/address';
import { abi as OlympusStakingAbi } from '../../../abis/OlympusStaking.json';
import { OlympusStaking } from '../../../typechain';

export const changeApproval = createAsyncThunk(
  'bond/changeApproval',
  async ({address, bond, provider, networkID}: IApproveBondAsyncThunk, {dispatch}) => {
    if (!provider) {
      dispatch(error('Please connect your wallet!'));
      return;
    }

    const signer = provider.getSigner();
    const reserveContract = bond.getContractForReserve(networkID, signer);
    const bondAddr = bond.getAddressForBond(networkID);

    let approveTx;
    let bondAllowance = await reserveContract.allowance(address, bondAddr);

    // return early if approval already exists
    if (bondAllowance.gt(BigNumber.from('0'))) {
      dispatch(info('Approval completed.'));
      dispatch(calculateUserBondDetails({address, bond, networkID, provider}));
      return;
    }

    try {
      approveTx = await reserveContract.approve(bondAddr, ethers.utils.parseUnits('1000000000', 'ether').toString());
      dispatch(
        fetchPendingTxs({
          txHash: approveTx.hash,
          text: 'Approving ' + bond.displayName,
          type: 'approve_' + bond.name,
        }),
      );
      await approveTx.wait();
    } catch (e: unknown) {
      dispatch(error((e as IJsonRPCError).message));
    } finally {
      if (approveTx) {
        dispatch(clearPendingTx(approveTx.hash));
        dispatch(calculateUserBondDetails({address, bond, networkID, provider}));
      }
    }
  },
);

export const calcBondDetails = createAsyncThunk(
  'bond/calcBondDetails',
  async ({bond, value, provider, networkID}: ICalcBondDetailsAsyncThunk, {dispatch}): Promise<IBondDetails> => {
    if (!value || value === '') {
      console.log('value is null');
      value = '0';
    }
    const amountInWei = ethers.utils.parseEther(value);

    let bondPrice = BigNumber.from(0);
    let bondDiscount = 0;
    let valuation = 0;
    let bondQuote: BigNumberish;
    const bondContract = bond.getContractForBond(networkID, provider);
    const specialBondCalcContract = getSpecialBondCalculatorContract(networkID, provider);

    const terms = await bondContract.terms();
    const maxBondPrice = await bondContract.maxPayout();
    let shibPrice = await getShibPrice()
    let flokiPrice = await getFlokiPrice()
    let debtRatio: BigNumberish = await bondContract.standardizedDebtRatio();
    debtRatio = Number(debtRatio.toString()) / Math.pow(10, 9);
    let marketPrice: number = 0;
    try {
      const originalPromiseResult = await dispatch(
        loadMarketPrice({networkID: networkID, provider: provider}),
      ).unwrap();
      marketPrice = originalPromiseResult?.marketPrice;
    } catch (rejectedValueOrSerializedError) {
      // handle error here
      console.error('Returned a null response from dispatch(loadMarketPrice)');
    }

    try {
      // TODO (appleseed): improve this logic
      if (bond.name === 'shib') {
        bondPrice = await bondContract.bondPriceInUSD();
        const first = (marketPrice - (Number(bondPrice.toString()) * Math.pow(10, -18)) * shibPrice)
        bondDiscount = first / marketPrice;
      } else if (bond.name === 'floki') {
        bondPrice = await bondContract.bondPriceInUSD();
        const first = (marketPrice - (Number(bondPrice.toString()) * Math.pow(10, -9)) * flokiPrice)
        bondDiscount = first / marketPrice;
      } else if (bond.name === 'dog_eth_lp') {
        bondPrice = await bondContract.bondPrice();
        const token = bond.getContractForReserve(networkID, provider)
        let reserves = await token.getReserves()
        let reserves0 = Number(reserves[0].toString())
        let reserves1 = Number(reserves[1].toString())
        let dPrice = await getDogPrice()
        let wethPrice = await getEthPrice()
        console.log(dPrice)
        let lpValue = (dPrice * (reserves0 * Math.pow(10, -9))) + ((wethPrice * reserves1 * Math.pow(10, -18)))
        let val = await specialBondCalcContract.valuation(bond.getAddressForReserve(networkID), 1)
        const lpTokenSupply = await token.totalSupply()
        let lpTokenValue = lpValue / Number(lpTokenSupply.toString()) * Math.pow(10, 18)

        let num = (Number(bondPrice.toString()) * lpTokenValue) / (Number(val.toString()) * Math.pow(10, 11)) * Math.pow(10, 18)
        bondPrice = BigNumber.from(num.toString())
        const first = (marketPrice - (Number(bondPrice.toString()) * Math.pow(10, -18)))
        const second = marketPrice;
        console.log(bondPrice)
        bondDiscount = first / second;
      } else {
        bondPrice = await bondContract.bondPrice();
        let wethPrice = await getEthPrice()
        let val = await specialBondCalcContract.valuation(bond.getAddressForReserve(networkID), 1)
        let dynamic = ((Number(bondPrice.toString()) * (wethPrice * Math.pow(10, 18))) / Number(val.toString())) * Math.pow(10, -11)
        bondPrice = BigNumber.from(dynamic.toString())
        bondDiscount = (marketPrice * Math.pow(10, 18) - Number(bondPrice.toString())) / Number(bondPrice.toString()); // 1 - bondPrice / (bondPrice * Math.pow(10, 9));
      }
    } catch (e) {
      console.log('error getting bondPriceInUSD', e);
    }

    if (Number(value) === 0) {
      // if inputValue is 0 avoid the bondQuote calls
      bondQuote = BigNumber.from(0);
    } else if (bond.isLp) {
      valuation = Number(
        (await specialBondCalcContract.valuation(bond.getAddressForReserve(networkID), amountInWei)).toString(),
      );
      bondQuote = await bondContract.payoutFor(valuation);
      if (!amountInWei.isZero() && Number(bondQuote.toString()) < 100000) {
        bondQuote = BigNumber.from(0);
        const errorString = 'Amount is too small!';
        dispatch(error(errorString));
      } else {
        bondQuote = Number(bondQuote.toString()) / Math.pow(10, 9);
      }
    } else {
      // RFV = DAI
      bondQuote = await bondContract.payoutFor(amountInWei);
      if (!amountInWei.isZero() && Number(bondQuote.toString()) < 10000000) {
        bondQuote = BigNumber.from(0);
        const errorString = 'Amount is too small!';
        dispatch(error(errorString));
      } else {
        if (bond.name === 'eth' || bond.name === 'dog_eth_lp') {
          bondQuote = Number(bondQuote.toString()) / Math.pow(10, 9);

        } else {
          bondQuote = Number(bondQuote.toString()) / Math.pow(10, 18);
        }
      }
    }

    // Display error if user tries to exceed maximum.
    if (!!value && parseFloat(bondQuote.toString()) > Number(maxBondPrice.toString()) / Math.pow(10, 9)) {
      const errorString =
        'You\'re trying to bond more than the maximum payout available! The maximum bond payout is ' +
        (Number(maxBondPrice.toString()) / Math.pow(10, 9)).toFixed(2).toString() +
        ' 3DOG.';
      dispatch(error(errorString));
    }

    // Calculate bonds purchased
    let purchased = await bond.getTreasuryBalance(networkID, provider);
    if (bond.name === 'shib') {
      return {
        bond: bond.name,
        bondDiscount,
        debtRatio: Number(debtRatio.toString()),
        bondQuote: Number(bondQuote.toString()),
        purchased,
        vestingTerm: Number(terms.vestingTerm.toString()),
        maxBondPrice: Number(maxBondPrice.toString()) / Math.pow(10, 9),
        bondPrice: Number(bondPrice.toString()) / Math.pow(10, 18) * shibPrice,
        marketPrice: marketPrice,
      };
    } else if (bond.name === 'floki') {
      return {
        bond: bond.name,
        bondDiscount,
        debtRatio: Number(debtRatio.toString()),
        bondQuote: Number(bondQuote.toString()),
        purchased,
        vestingTerm: Number(terms.vestingTerm.toString()),
        maxBondPrice: Number(maxBondPrice.toString()) / Math.pow(10, 9),
        bondPrice: Number(bondPrice.toString()) / Math.pow(10, 9) * flokiPrice,
        marketPrice: marketPrice,
      };
    } else {
      return {
        bond: bond.name,
        bondDiscount,
        debtRatio: Number(debtRatio.toString()),
        bondQuote: Number(bondQuote.toString()),
        purchased,
        vestingTerm: Number(terms.vestingTerm.toString()),
        maxBondPrice: Number(maxBondPrice.toString()) / Math.pow(10, 9),
        bondPrice: Number(bondPrice.toString()) / Math.pow(10, 18),
        marketPrice: marketPrice,
      };
    }
  },
);

export const bondAsset = createAsyncThunk(
  'bond/bondAsset',
  async ({value, address, bond, networkID, provider, slippage}: IBondAssetAsyncThunk, {dispatch}) => {
    const depositorAddress = address;
    const acceptedSlippage = 0.2; // 0.5% as default
    // parseUnits takes String => BigNumber
    let valueInWei
    if (bond.name === 'floki') {
      valueInWei = ethers.utils.parseUnits(value.toString(), 'gwei');
    } else {
      valueInWei = ethers.utils.parseUnits(value.toString(), 'ether');
    }
    const signer = provider.getSigner();
    const bondContract = bond.getContractForBond(networkID, signer);
    const calculatePremium = await bondContract.bondPrice();
    const maxPremium = Math.round(Number(calculatePremium.toString()) * (1 + acceptedSlippage));

    // Deposit the bond
    let bondTx;
    let uaData = {
      address: address,
      value: value,
      type: 'Bond',
      bondName: bond.displayName,
      approved: true,
      txHash: '',
    };
    try {
      bondTx = await bondContract.deposit(valueInWei, maxPremium, depositorAddress);
      dispatch(
        fetchPendingTxs({
          txHash: bondTx.hash,
          text: 'Bonding ' + bond.displayName,
          type: 'bond_' + bond.name
        }),
      );
      uaData.txHash = bondTx.hash;
      await bondTx.wait();
      // TODO: it may make more sense to only have it in the finally.
      // UX preference (show pending after txn complete or after balance updated)

      dispatch(calculateUserBondDetails({address, bond, networkID, provider}));
    } catch (e: unknown) {
      const rpcError = e as IJsonRPCError;
      if (rpcError.code === -32603 && rpcError.message.indexOf('ds-math-sub-underflow') >= 0) {
        dispatch(
          error('You may be trying to bond more than your balance! Error code: 32603. Message: ds-math-sub-underflow'),
        );
      } else dispatch(error(rpcError.message));
    }
  },
);

export const redeemBond = createAsyncThunk(
  'bond/redeemBond',
  async ({address, bond, networkID, provider, autostake}: IRedeemBondAsyncThunk, {dispatch}) => {
    if (!provider) {
      dispatch(error('Please connect your wallet!'));
      return;
    }

    const signer = provider.getSigner();
    const bondContract = bond.getContractForBond(networkID, signer);

    const stakingContract = new ethers.Contract(
      addressGroup[networkID].STAKING_ADDRESS as string,
      OlympusStakingAbi,
      provider,
    ) as OlympusStaking;


    let redeemTx;
    let uaData = {
      address: address,
      type: 'Redeem',
      bondName: bond.displayName,
      autoStake: autostake,
      approved: true,
      txHash: '',
    };
    try {
      redeemTx = await bondContract.redeem(address, autostake === true);
      const pendingTxnType = 'redeem_bond_' + bond + (autostake === true ? '_autostake' : '');
      uaData.txHash = redeemTx.hash;
      dispatch(
        fetchPendingTxs({txHash: redeemTx.hash, text: 'Redeeming ' + bond.displayName, type: pendingTxnType}),
      );

      await redeemTx.wait();
      if (autostake) {
        //claim 3DOGs
        let claimTx = await stakingContract.claim(address);
        await claimTx.wait();
      }

      await dispatch(calculateUserBondDetails({address, bond, networkID, provider}));

      dispatch(getBalances({address, networkID, provider}));
    } catch (e: unknown) {
      uaData.approved = false;
      dispatch(error((e as IJsonRPCError).message));
    }
  },
);

// Note(zx): this is a barebones interface for the state. Update to be more accurate
interface IBondSlice {
  status: string;

  [key: string]: any;
}

const setBondState = (state: IBondSlice, payload: any) => {
  const bond = payload.bond;
  state[bond] = {...state[bond], ...payload};
  state.loading = false;
};

const initialState: IBondSlice = {
  status: 'idle',
};

const bondingSlice = createSlice({
  name: 'bonding',
  initialState,
  reducers: {
    fetchBondSuccess(state, action) {
      state[action.payload.bond] = action.payload;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(calcBondDetails.pending, state => {
        state.loading = true;
      })
      .addCase(calcBondDetails.fulfilled, (state, action) => {
        setBondState(state, action.payload);
        state.loading = false;
      })
      .addCase(calcBondDetails.rejected, (state, {error}) => {
        state.loading = false;
        console.error(error.message);
      });
  },
});

export default bondingSlice.reducer;

export const {fetchBondSuccess} = bondingSlice.actions;

const baseInfo = (state: RootState) => state.bonding;

export const getBondingState = createSelector(baseInfo, bonding => bonding);
