import { JsonRpcProvider, StaticJsonRpcProvider } from '@ethersproject/providers';
import { NetworkID } from './base';

export interface NetworkConfig {
  readonly networkID: NetworkID;
  readonly provider: StaticJsonRpcProvider | JsonRpcProvider;
}
