import { NetworkBaseInfo, NetworkBaseInfoKey } from '../interfaces/dashboard';

export const defaultNetworkBaseInfos: NetworkBaseInfo[] = [
  {
    name: 'Market Cap',
    value: null,
    key: NetworkBaseInfoKey.MarketCap
  },
  {
    name: '3DOG Price',
    value: null,
    key: NetworkBaseInfoKey.ThreeDogPrice
  },
  {
    name: 'APY',
    value: null,
    key: NetworkBaseInfoKey.Apy
  },
  {
    name: 'Circulating Supply (total)',
    value: null,
    key: NetworkBaseInfoKey.CirculatingSupply
  },
  {
    name: 'Backing per 3DOG',
    value: null,
    key: NetworkBaseInfoKey.BackingPerThreeDog
  },
  {
    name: 'Current Index',
    value: null,
    key: NetworkBaseInfoKey.CurrentIndex,
    hasTooltip: true,
    message: 'The current index tracks the amount of s3DOG accumulated since the beginning of staking. Basically, how much s3DOG one would have if they staked and held a single 3DOG from day 1.'
  },
];
