import { JsonRpcProvider, StaticJsonRpcProvider } from '@ethersproject/providers';

import { Bond } from '../lib/bond'

export enum NetworkID {
  Mainnet = 1,
  Testnet = 4,
}

export interface IJsonRpcError {
  readonly message: string;
  readonly code: number;
}

export interface IBaseAsyncThunk {
  readonly networkID: NetworkID;
  readonly provider: StaticJsonRpcProvider | JsonRpcProvider;
}

export interface IBaseAddressAsyncThunk extends IBaseAsyncThunk {
  readonly address: string;
}

export interface IBaseBondAsyncThunk extends IBaseAsyncThunk {
  readonly bond: Bond;
}

export interface ICalcUserBondDetailsAsyncThunk extends IBaseAddressAsyncThunk, IBaseBondAsyncThunk {
}

export interface IPendingTx {
  readonly txHash: string;
  readonly text: string;
  readonly type: string;
}

export enum BaseInfoKey {
  MarketCap = 'MARKET_CAP',
  ThreeDogPrice = 'MARKET_PRICE',
  Apy = 'APY',
  CirculatingSupply = 'CIRCULATING_SUPPLY',
  BackingPerThreeDog = 'BACKING_PER_THREE_DOG',
  CurrentIndex = 'CURRENT_INDEX',
  TotalValueDeposited = 'TOTAL_VALUE_DEPOSITED',
  UnStakedBalance = 'UNSTAKED_BALANCE',
  StakedBalance = 'STAKED_BALANCE',
  NextRewardAmount = 'NEXT_REWARD_AMOUNT',
  NextRewardYield = 'NEXT_REWARD_YIELD',
  FiveDaysRate = 'FIVE_DAYS_RATE',
  ThreeDogsBalance = 'DOG_BALANCE',
}

export interface BaseInfo {
  name: string;
  value: string;
  key?: string;
  hasTooltip?: Boolean;
  message?: string;
}
