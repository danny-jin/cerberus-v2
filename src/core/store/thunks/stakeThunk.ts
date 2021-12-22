import { createAsyncThunk } from '@reduxjs/toolkit';
import { ethers, BigNumber } from 'ethers';

import { fetchAccountSuccess, getBalances } from '../slices/accountSlice';
import { clearPendingTx, fetchPendingTxs, getStakingTypeText } from '../slices/pendingTxSlice';
import { error, info } from '../slices/messageSlice';
import { IActionValueAsyncThunk, IChangeApprovalAsyncThunk, IJsonRpcError } from '../../interfaces/base';
import { addressGroup } from '../../data/address';

import { IERC20, OlympusStaking, StakingHelper } from '../../../typechain';
import { abi as IERC20Abi } from '../../../abis/IERC20.json';
import { abi as OlympusStakingAbi } from '../../../abis/OlympusStaking.json';
import { abi as StakingHelperABI } from '../../../abis/StakingHelper.json';

interface IUAData {
  address: string;
  value: string;
  approved: boolean;
  txHash: string | null;
  type: string | null;
}

function alreadyApprovedToken(token: string, stakeAllowance: BigNumber, unStakeAllowance: BigNumber) {
  // set defaults
  let bigZero = BigNumber.from('0');
  let applicableAllowance = bigZero;

  // determine which allowance to check
  if (token === 'ohm') {
    applicableAllowance = stakeAllowance;
  } else if (token === 'sOhm') {
    applicableAllowance = unStakeAllowance;
  }

  // check if allowance exists
  if (applicableAllowance.gt(bigZero)) return true;

  return false;
}

export const changeApproval = createAsyncThunk(
  'stake/changeApproval',
  async ({token, provider, address, networkID}: IChangeApprovalAsyncThunk, {dispatch}) => {
    if (!provider) {
      dispatch(error('Please connect your wallet!'));
      return;
    }

    const signer = provider.getSigner();
    const ohmContract = new ethers.Contract(addressGroup[networkID].OHM_ADDRESS as string, IERC20Abi, signer) as IERC20;
    const sohmContract = new ethers.Contract(addressGroup[networkID].SOHM_ADDRESS as string, IERC20Abi, signer) as IERC20;
    let approveTx;
    let stakeAllowance = await ohmContract.allowance(address, addressGroup[networkID].STAKING_HELPER_ADDRESS);
    let unStakeAllowance = await sohmContract.allowance(address, addressGroup[networkID].STAKING_ADDRESS);

    // return early if approval has already happened
    if (alreadyApprovedToken(token, stakeAllowance, unStakeAllowance)) {
      dispatch(info('Approval completed.'));
      return dispatch(
        fetchAccountSuccess({
          staking: {
            ohmStake: +stakeAllowance,
            ohmUnStake: +unStakeAllowance,
          },
        }),
      );
    }

    try {
      if (token === 'ohm') {
        // won't run if stakeAllowance > 0
        approveTx = await ohmContract.approve(
          addressGroup[networkID].STAKING_HELPER_ADDRESS,
          ethers.utils.parseUnits('1000000000', 'gwei').toString(),
        );
      } else if (token === 'sohm') {
        approveTx = await sohmContract.approve(
          addressGroup[networkID].STAKING_ADDRESS,
          ethers.utils.parseUnits('1000000000', 'gwei').toString(),
        );
      }

      const text = 'Approve ' + (token === 'ohm' ? 'Staking' : 'Unstaking');
      const pendingTxnType = token === 'ohm' ? 'approve_staking' : 'approve_unstaking';
      if (approveTx) {
        dispatch(fetchPendingTxs({txHash: approveTx.hash, text, type: pendingTxnType}));
        await approveTx.wait();
      }
    } catch (e: unknown) {
      dispatch(error((e as IJsonRpcError).message));
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTx(approveTx.hash));
      }
    }

    // go get fresh allowances
    stakeAllowance = await ohmContract.allowance(address, addressGroup[networkID].STAKING_HELPER_ADDRESS);
    unStakeAllowance = await sohmContract.allowance(address, addressGroup[networkID].STAKING_ADDRESS);

    return dispatch(
      fetchAccountSuccess({
        staking: {
          ohmStake: +stakeAllowance,
          ohmUnStake: +unStakeAllowance,
        },
      }),
    );
  },
);

export const changeStake = createAsyncThunk(
  'stake/changeStake',
  async ({action, value, provider, address, networkID}: IActionValueAsyncThunk, {dispatch}) => {
    if (!provider) {
      dispatch(error('Please connect your wallet!'));
      return;
    }
    const signer = provider.getSigner();
    const staking = new ethers.Contract(
      addressGroup[networkID].STAKING_ADDRESS as string,
      OlympusStakingAbi,
      signer,
    ) as OlympusStaking;
    const stakingHelper = new ethers.Contract(
      addressGroup[networkID].STAKING_HELPER_ADDRESS as string,
      StakingHelperABI,
      signer,
    ) as StakingHelper;

    let stakeTx;
    let uaData: IUAData = {
      address: address,
      value: value,
      approved: true,
      txHash: null,
      type: null,
    };
    try {
      if (action === 'stake') {
        uaData.type = 'stake';
        stakeTx = await stakingHelper.stake(ethers.utils.parseUnits(value, 'gwei'));
      } else {
        uaData.type = 'unstake';
        stakeTx = await staking.unstake(ethers.utils.parseUnits(value, 'gwei'), true);
      }
      const pendingTxnType = action === 'stake' ? 'staking' : 'unstaking';
      uaData.txHash = stakeTx.hash;
      dispatch(fetchPendingTxs({txHash: stakeTx.hash, text: getStakingTypeText(action), type: pendingTxnType}));
      await stakeTx.wait();
    } catch (e: unknown) {
      uaData.approved = false;
      const rpcError = e as IJsonRpcError;
      if (rpcError.code === -32603 && rpcError.message.indexOf('ds-math-sub-underflow') >= 0) {
        dispatch(
          error('You may be trying to stake more than your balance! Error code: 32603. Message: ds-math-sub-underflow'),
        );
      } else {
        dispatch(error(rpcError.message));
      }
      return;
    } finally {
      if (stakeTx) {
        dispatch(clearPendingTx(stakeTx.hash));
      }
    }
    dispatch(getBalances({address, networkID, provider}));
  },
);
