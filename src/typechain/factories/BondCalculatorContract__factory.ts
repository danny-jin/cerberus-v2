import { Provider } from '@ethersproject/providers';
import { Contract, Signer, utils } from 'ethers';

import type {
  BondCalculatorContract,
  BondCalculatorContractInterface,
} from '../BondCalculatorContract';

const _abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_OHM',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'OHM',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_pair',
        type: 'address',
      },
    ],
    name: 'getKValue',
    outputs: [
      {
        internalType: 'uint256',
        name: 'k_',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_pair',
        type: 'address',
      },
    ],
    name: 'getTotalValue',
    outputs: [
      {
        internalType: 'uint256',
        name: '_value',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_pair',
        type: 'address',
      },
    ],
    name: 'markdown',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_pair',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount_',
        type: 'uint256',
      },
    ],
    name: 'valuation',
    outputs: [
      {
        internalType: 'uint256',
        name: '_value',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];

export class BondCalculatorContract__factory {
  static readonly abi = _abi;

  static createInterface(): BondCalculatorContractInterface {
    return new utils.Interface(_abi) as BondCalculatorContractInterface;
  }

  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): BondCalculatorContract {
    return new Contract(address, _abi, signerOrProvider) as BondCalculatorContract;
  }
}
