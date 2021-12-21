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

export interface IChangeApprovalAsyncThunk extends IBaseAsyncThunk {
  readonly token: string;
  readonly address: string;
}

export interface IActionAsyncThunk extends IBaseAsyncThunk {
  readonly action: string;
  readonly address: string;
}

export interface IValueAsyncThunk extends IBaseAsyncThunk {
  readonly value: string;
  readonly address: string;
}

export interface IActionValueAsyncThunk extends IValueAsyncThunk {
  readonly action: string;
}

export interface IApproveBondAsyncThunk extends IBaseBondAsyncThunk {
  readonly address: string;
}

export interface IBondAssetAsyncThunk extends IBaseBondAsyncThunk, IValueAsyncThunk {
  readonly slippage: number;
}

export interface ICalcBondDetailsAsyncThunk extends IBaseBondAsyncThunk {
  readonly value: string;
}

export interface IJsonRPCError {
  readonly message: string;
  readonly code: number;
}

export interface IRedeemAllBondsAsyncThunk extends IBaseAsyncThunk {
  readonly bonds: Bond[];
  readonly address: string;
  readonly autostake: boolean;
}

export interface IRedeemBondAsyncThunk extends IBaseBondAsyncThunk {
  readonly address: string;
  readonly autostake: boolean;
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
  TreasuryBalance = 'TREASURY_BALANCE',
  OwnerBalance = 'OWNER_BALANCE',
  Roi = 'ROI',
  DebtRate = 'DEBT_RATE',
  PendingRewardAmount = 'PENDING_REWARD_AMOUNT',
  ClaimRewardAmount = 'CLAIM_REWARD_AMOUNT',
  RestVestingTime = 'REST_VESTING_TIME',
  VestingTerm = 'VESTING_TERM'
}

export interface BaseInfo {
  name: string;
  value: string;
  key?: string;
  hasTooltip?: Boolean;
  message?: string;
}

export interface BondInfo {
  bond: string;
  price: string;
  roi: string;
  purchased: string;
  state: boolean;
}
