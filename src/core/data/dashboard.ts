import { BaseInfo, BaseInfoKey } from '../interfaces/base';

export const defaultNetworkBaseInfos: BaseInfo[] = [
  {
    name: 'Market Cap',
    value: null,
    key: BaseInfoKey.MarketCap
  },
  {
    name: '3DOG Price',
    value: null,
    key: BaseInfoKey.ThreeDogPrice
  },
  {
    name: 'APY',
    value: null,
    key: BaseInfoKey.Apy
  },
  {
    name: 'Circulating Supply (total)',
    value: null,
    key: BaseInfoKey.CirculatingSupply
  },
  {
    name: 'Backing per 3DOG',
    value: null,
    key: BaseInfoKey.BackingPerThreeDog
  },
  {
    name: 'Current Index',
    value: null,
    key: BaseInfoKey.CurrentIndex,
    hasTooltip: true,
    message: 'The current index tracks the amount of s3DOG accumulated since the beginning of staking. Basically, how much s3DOG one would have if they staked and held a single 3DOG from day 1.'
  },
];
