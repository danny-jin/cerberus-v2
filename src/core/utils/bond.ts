import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { ethers } from 'ethers';

import { NetworkID } from '../interfaces/base';
import { addressGroup } from '../data/address';
import { abi as BondCalculatorContractAbi } from '../../abis/BondCalculatorContract.json';

import { BondCalculatorContract } from '../../typechain';

export function getBondCalculatorContract(networkID: NetworkID, provider: StaticJsonRpcProvider) {
  return new ethers.Contract(
    addressGroup[networkID].BONDING_CALCULATOR_ADDRESS as string,
    BondCalculatorContractAbi,
    provider,
  ) as BondCalculatorContract;
}

export function getSpecialBondCalculatorContract(networkID: NetworkID, provider: StaticJsonRpcProvider) {
  return new ethers.Contract(
    addressGroup[networkID].SPECIAL_BONDING_CALCULATOR_ADDRESS as string,
    BondCalculatorContractAbi,
    provider,
  ) as BondCalculatorContract;
}
