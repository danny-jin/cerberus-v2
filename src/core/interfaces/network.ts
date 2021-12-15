import { JsonRpcProvider, StaticJsonRpcProvider } from '@ethersproject/providers';

export enum NetworkID {
  Mainnet = 1,
  Testnet = 4,
}

export interface JsonRpcError {
  readonly message: string;
  readonly code: number;
}

export interface NetworkConfig {
  readonly networkID: NetworkID;
  readonly provider: StaticJsonRpcProvider | JsonRpcProvider;
}
