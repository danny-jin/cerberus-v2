import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ethers } from 'ethers';

import { apolloClient } from '../../apollo/client';
import { NetworkConfig } from '../../interfaces/network';
import { getTokenPrice } from '../../utils/price';
import { boundObject } from '../../utils/base';
import { protocolMetricsQuery } from '../../data/query';
import { addressGroup } from '../../data/address';

import { OlympusStaking, SOhm } from '../../../typechain';
import { abi as OlympusStakingAbi } from '../../../abis/OlympusStaking.json';
import { abi as SOhmAbi } from '../../../abis/SOhm.json';

export interface AppData {
  readonly currentIndex?: string;
  readonly circulatingSupply: number;
  readonly currentBlock?: number;
  readonly fiveDaysRate?: number;
  readonly nextRebase?: number;
  readonly marketCap: number;
  readonly marketPrice: number;
  readonly stakingApy?: number;
  readonly stakingRebase?: number;
  readonly stakingTvl: number;
  readonly totalSupply: number;
  readonly treasuryMarketValue?: number;
  readonly isCollapsed?: Boolean;
}

const initialState = {
  appDetailLoading: false,
  marketPriceLoading: false,
  currentIndex: null,
  circulatingSupply: null,
  currentBlock: null,
  fiveDaysRate: null,
  nextRebase: null,
  marketCap: null,
  marketPrice: null,
  stakingApy: null,
  stakingRebase: null,
  stakingTvl: null,
  totalSupply: null,
  treasuryMarketValue: null,
  isCollapsed: true
}

const getMarketPrice = createAsyncThunk('getMarketPrice', async () => {
  let marketPrice: number;
  try {
    marketPrice = await getTokenPrice('cerberus');
  } catch (e) {
    console.log('failed to get market price.');
  }
  return {marketPrice};
});

export const fetchAppDetails = createAsyncThunk('fetchAppDetails', async ({networkID, provider}: NetworkConfig, {}) => {
  const result = await apolloClient(protocolMetricsQuery);
  if (!result) {
    console.log('returned a null response when querying graph server.');
    return;
  }

  const stakingTvl = parseFloat(result.data.protocolMetrics[0].totalValueLocked);
  const marketPrice = parseFloat(result.data.protocolMetrics[0].ohmPrice);
  const marketCap = parseFloat(result.data.protocolMetrics[0].marketCap);
  const circulatingSupply = parseFloat(result.data.protocolMetrics[0].ohmCirculatingSupply);
  const totalSupply = parseFloat(result.data.protocolMetrics[0].totalSupply);
  const treasuryMarketValue = parseFloat(result.data.protocolMetrics[0].treasuryMarketValue);

  if (!provider) {
    console.log('failed to connect to provider, please connect your wallet.');
    return {
      stakingTvl,
      marketPrice,
      marketCap,
      circulatingSupply,
      totalSupply,
      treasuryMarketValue,
    }
  }

  const currentBlock = await provider.getBlockNumber();
  const stakingContract = new ethers.Contract(
    addressGroup[networkID].STAKING_ADDRESS as string,
    OlympusStakingAbi,
    provider
  ) as OlympusStaking;

  const sOhmContract = new ethers.Contract(
    addressGroup[networkID].SOHM_ADDRESS as string,
    SOhmAbi,
    provider
  ) as SOhm;

  const epoch = await stakingContract.epoch();
  const nextRebase = Number(epoch.endBlock);
  const stakingReward = epoch.distribute;
  const sOhmCirculatingSupply = await sOhmContract.circulatingSupply();
  const stakingRebase = Number(stakingReward.toString()) / Number(sOhmCirculatingSupply.toString());
  const fiveDaysRate = Math.pow(1 + stakingRebase, 5 * 3) - 1;
  const stakingApy = Math.pow(1 + stakingRebase, 365 * 3) - 1;
  const currentIndex = await stakingContract.index();

  return {
    currentIndex: ethers.utils.formatUnits(currentIndex, 'gwei'),
    currentBlock,
    fiveDaysRate,
    stakingApy,
    nextRebase,
    stakingTvl,
    stakingRebase,
    marketCap,
    marketPrice,
    circulatingSupply,
    totalSupply,
    treasuryMarketValue,
  } as AppData;
});

export const fetchMarketPrice = createAsyncThunk(
  'fetchMarketPrice',
  async ({networkID, provider}: NetworkConfig, {dispatch, getState}) => {
    const state: any = getState();
    let marketPrice;
    // check if we already have loaded market price
    if (state.app.marketPriceLoading === false && state.app.marketPrice) {
      // go get marketPrice from app.state
      marketPrice = state.app.marketPrice;
    } else {
      // we don't have marketPrice in app.state, so go get it
      try {
        const originalPromiseResult = await dispatch(getMarketPrice()).unwrap();
        marketPrice = originalPromiseResult?.marketPrice;
      } catch (rejectedValueOrSerializedError) {
        console.error('returned a null response from dispatch(loadMarketPrice)');
        return;
      }
    }
    return {marketPrice};
  },
);


const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      boundObject(state, action.payload);
    },
    toggleSidebar(state) {
      state.isCollapsed = !state.isCollapsed;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAppDetails.pending, state => {
        state.appDetailLoading = true;
      })
      .addCase(fetchAppDetails.fulfilled, (state, action) => {
        boundObject(state, action.payload);
        state.appDetailLoading = false;
      })
      .addCase(fetchAppDetails.rejected, (state, {error}) => {
        state.appDetailLoading = false;
        console.error(error.name, error.message, error.stack);
      })
      .addCase(fetchMarketPrice.pending, (state, action) => {
        state.marketPriceLoading = true;
      })
      .addCase(fetchMarketPrice.fulfilled, (state, action) => {
        boundObject(state, action.payload);
        state.marketPriceLoading = false;
      })
      .addCase(fetchMarketPrice.rejected, (state, {error}) => {
        state.marketPriceLoading = false;
        console.error(error.name, error.message, error.stack);
      });
  },
});

export const { toggleSidebar } = appSlice.actions;

export default appSlice.reducer;

