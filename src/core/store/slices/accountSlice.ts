import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { BigNumber, BigNumberish, ethers } from 'ethers';

import { IBaseAddressAsyncThunk, ICalcUserBondDetailsAsyncThunk } from '../../interfaces/base';
import { boundObject } from '../../utils/base';
import { addressGroup } from '../../data/address';

import { IERC20, SOhm } from '../../../typechain';
import { abi as IERC20Abi } from '../../../abis/IERC20.json';
import { abi as SOhmAbi } from '../../../abis/SOhm.json';

interface IUserBalances {
  balances: {
    ohm: string;
    sOhm: string;
  };
}

export const getBalances = createAsyncThunk(
  'account/getBalances',
  async ({address, networkID, provider}: IBaseAddressAsyncThunk) => {
    const ohmContract = new ethers.Contract(addressGroup[networkID].OHM_ADDRESS as string, IERC20Abi, provider) as IERC20;
    const ohmBalance = await ohmContract.balanceOf(address);
    const sOhmContract = new ethers.Contract(
      addressGroup[networkID].SOHM_ADDRESS as string,
      IERC20Abi,
      provider,
    ) as IERC20;
    const sOhmBalance = await sOhmContract.balanceOf(address);
    return {
      balances: {
        ohm: ethers.utils.formatUnits(ohmBalance, 'gwei'),
        sOhm: ethers.utils.formatUnits(sOhmBalance, 'gwei'),
      },
    };
  },
);

export interface IUserAccountStakingDetails {
  staking: {
    ohmStake: number;
    ohmUnStake: number;
  };
}

export const loadAccountDetails = createAsyncThunk(
  'account/loadAccountDetails',
  async ({networkID, provider, address}: IBaseAddressAsyncThunk, {dispatch}) => {
    const ohmContract = new ethers.Contract(addressGroup[networkID].OHM_ADDRESS as string, IERC20Abi, provider) as IERC20;
    const stakeAllowance = await ohmContract.allowance(address, addressGroup[networkID].STAKING_HELPER_ADDRESS);

    const sOhmContract = new ethers.Contract(addressGroup[networkID].SOHM_ADDRESS as string, SOhmAbi, provider) as SOhm;
    const unStakeAllowance = await sOhmContract.allowance(address, addressGroup[networkID].STAKING_ADDRESS);
    await dispatch(getBalances({address, networkID, provider}));

    return {
      staking: {
        ohmStake: +stakeAllowance,
        ohmUnStake: +unStakeAllowance,
      },
    };
  },
);

export interface IUserBondDetails {
  allowance: number;
  interestDue: number;
  bondMaturationBlock: number;
  pendingPayout: string; //Payout formatted in gwei.
}

export const calculateUserBondDetails = createAsyncThunk(
  'account/calculateUserBondDetails',
  async ({address, bond, networkID, provider}: ICalcUserBondDetailsAsyncThunk) => {
    if (!address) {
      return {
        bond: '',
        displayName: '',
        bondIconSvg: '',
        isLp: false,
        allowance: 0,
        balance: '0',
        interestDue: 0,
        bondMaturationBlock: 0,
        pendingPayout: '',
      };
    }

    // Calculate bond details.
    const bondContract = bond.getContractForBond(networkID, provider);
    const reserveContract = bond.getContractForReserve(networkID, provider);

    let pendingPayout, bondMaturationBlock;

    const bondDetails = await bondContract.bondInfo(address);
    let interestDue: BigNumberish = Number(bondDetails.payout.toString()) / Math.pow(10, 9);
    bondMaturationBlock = +bondDetails.vesting + +bondDetails.lastBlock;
    pendingPayout = await bondContract.pendingPayoutFor(address);

    let allowance = BigNumber.from(0);
    let balance = BigNumber.from(0);
    allowance = await reserveContract.allowance(address, bond.getAddressForBond(networkID));
    balance = await reserveContract.balanceOf(address);

    // formatEthers takes BigNumber => String
    let balanceVal;
    if (bond.name !== 'floki') {
      balanceVal = ethers.utils.formatEther(balance);
    } else {
      balanceVal = ethers.utils.formatUnits(balance, 'gwei');
    }
    // balanceVal should NOT be converted to a number. it loses decimal precision
    return {
      bond: bond.name,
      displayName: bond.displayName,
      bondIconSvg: bond.bondIconSvg,
      isLp: bond.isLp,
      allowance: Number(allowance.toString()),
      balance: balanceVal,
      interestDue,
      bondMaturationBlock,
      pendingPayout: ethers.utils.formatUnits(pendingPayout, 'gwei'),
    };
  },
);

interface IAccountSlice extends IUserAccountStakingDetails, IUserBalances {
  bonds: { [key: string]: IUserBondDetails };
  loading: boolean;
}

const initialState: IAccountSlice = {
  loading: false,
  bonds: {},
  balances: {ohm: null, sOhm: null},
  staking: {ohmStake: 0, ohmUnStake: 0},
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      boundObject(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAccountDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        boundObject(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAccountDetails.rejected, (state, {error}) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getBalances.pending, state => {
        state.loading = true;
      })
      .addCase(getBalances.fulfilled, (state, action) => {
        boundObject(state, action.payload);
        state.loading = false;
      })
      .addCase(getBalances.rejected, (state, {error}) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(calculateUserBondDetails.pending, state => {
        state.loading = true;
      })
      .addCase(calculateUserBondDetails.fulfilled, (state, action) => {
        if (!action.payload) return;
        const bond = action.payload.bond;
        state.bonds[bond] = action.payload;
        state.loading = false;
      })
      .addCase(calculateUserBondDetails.rejected, (state, {error}) => {
        state.loading = false;
        console.log(error);
      });
  },
});

export const {fetchAccountSuccess} = accountSlice.actions;

export default accountSlice.reducer;
