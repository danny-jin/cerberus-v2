import { BytesLike } from '@ethersproject/bytes';
import { Listener, Provider } from '@ethersproject/providers';
import { FunctionFragment, Result } from '@ethersproject/abi';
import {
  ethers,
  Signer,
  BigNumber,
  PopulatedTransaction,
  BaseContract,
  CallOverrides,
} from 'ethers';

import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from '../core/interfaces/typechain';

export interface ChainLinkAggregatorContractInterface extends ethers.utils.Interface {
  functions: {
    'latestAnswer()': FunctionFragment;
    'totalSupply()': FunctionFragment;
    'balanceOf(address)': FunctionFragment;
    'transfer(address,uint256)': FunctionFragment;
    'allowance(address,address)': FunctionFragment;
    'approve(address,uint256)': FunctionFragment;
    'transferFrom(address,address,uint256)': FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: 'latestAnswer',
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: 'latestAnswer',
    data: BytesLike
  ): Result;
}

export interface ChainLinkAggregatorContract extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;

  attach(addressOrName: string): this;

  deployed(): Promise<this>;

  interface: ChainLinkAggregatorContractInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;

  listeners(eventName?: string): Array<Listener>;

  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;

  removeAllListeners(eventName?: string): this;

  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    latestAnswer(overrides?: CallOverrides): Promise<[BigNumber]>;
  };

  latestAnswer(overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    latestAnswer(overrides?: CallOverrides): Promise<BigNumber>;
  };

  estimateGas: {
    latestAnswer(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    latestAnswer(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
