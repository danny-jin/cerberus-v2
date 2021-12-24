import { StaticJsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import React from 'react';
import { ethers } from 'ethers';

import { getTokenPriceFromApi } from '../utils/price';
import { TokenType } from '../interfaces/token';
import { NetworkID } from '../interfaces/base';
import { addressGroup } from '../data/address';

import { EthContract, PairContract } from '../../typechain';
import { abi as IERC20Abi } from '../../abis/IERC20.json';

export enum BondType {
  StableAsset,
  LP,
}

export interface Available {
  [NetworkID.Mainnet]?: boolean;
  [NetworkID.Testnet]?: boolean;
}

export interface BondAddressGroup {
  reserveAddress: string;
  bondAddress: string;
}

export interface IBondingStateView {
  account: {
    bonds: {
      [key: string]: IUserBondDetails;
    };
  };
  bonding: {
    loading: Boolean;
    [key: string]: any;
  };
}

export interface IUserBondDetails {
  allowance: number;
  interestDue: number;
  bondMaturationBlock: number;
  pendingPayout: string; //Payout formatted in gwei.
}

export interface IBondSlice {
  status: string;
  [key: string]: any;
}

export interface IBondDetails {
  bond: string;
  bondDiscount: number;
  debtRatio: number;
  bondQuote: number;
  purchased: number;
  vestingTerm: number;
  maxBondPrice: number;
  bondPrice: number;
  marketPrice: number;
}

export interface IAllBondData extends Bond, IBondDetails, IUserBondDetails {
}

export interface NetworkBondAddressGroup {
  [NetworkID.Mainnet]: BondAddressGroup;
  [NetworkID.Testnet]: BondAddressGroup;
}

export interface BondOption {
  name: string; // Internal name used for references
  displayName: string; // DisplayName on UI
  isAvailable: Available; // set false to hide
  bondIconSvg: React.ReactNode; //  SVG path for icons
  bondContractABI: ethers.ContractInterface; // ABI for contract
  networkBondAddressGroup: NetworkBondAddressGroup; // Mapping of network --> Addresses
  bondToken: string; // Unused, but native token to buy the bond.
  tokenType?: TokenType;
  decimals?: number;
  aggregatorDecimals?: number;
  ethUsdAggregatorDecimals?: number;
  chainLinkAggregatorAddress?: string;
  shibaEthAggregatorAddress?: string;
  ethUsdAggregatorAddress?: string;
  threeDogDecimals?: number;
  ethDecimals?: number;
}

export abstract class Bond {
  // Standard Bond fields regardless of LP bonds or stable bonds.
  readonly name: string;
  readonly displayName: string;
  readonly type: BondType;
  readonly isAvailable: Available;
  readonly bondIconSvg: React.ReactNode;
  readonly bondContractABI: ethers.ContractInterface; // Bond ABI
  readonly networkBondAddressGroup: NetworkBondAddressGroup;
  readonly bondToken: string;
  readonly price: number;
  readonly decimals?: number;
  readonly tokenType?: TokenType;
  readonly aggregatorDecimals?: number;
  readonly ethUsdAggregatorDecimals?: number;
  readonly chainLinkAggregatorAddress?: string;
  readonly shibaEthAggregatorAddress?: string;
  readonly ethUsdAggregatorAddress?: string;
  readonly threeDogDecimals?: number;
  readonly ethDecimals?: number;
  // The following two fields will differ on how they are set depending on bond type
  abstract isLp: Boolean;
  abstract reserveContract: ethers.ContractInterface; // Token ABI
  abstract displayUnits: string;

  // Async method that returns a Promise
  abstract getTreasuryBalance(networkID: NetworkID, provider: StaticJsonRpcProvider): Promise<number>;

  constructor(type: BondType, bondOption: BondOption) {
    this.name = bondOption.name;
    this.displayName = bondOption.displayName;
    this.type = type;
    this.isAvailable = bondOption.isAvailable;
    this.bondIconSvg = bondOption.bondIconSvg;
    this.bondContractABI = bondOption.bondContractABI;
    this.networkBondAddressGroup = bondOption.networkBondAddressGroup;
    this.bondToken = bondOption.bondToken;
    this.decimals = bondOption.decimals;
    this.aggregatorDecimals = bondOption.aggregatorDecimals;
    this.ethUsdAggregatorDecimals = bondOption.ethUsdAggregatorDecimals;
    this.tokenType = bondOption.tokenType;
    this.chainLinkAggregatorAddress = bondOption.chainLinkAggregatorAddress;
    this.shibaEthAggregatorAddress = bondOption.shibaEthAggregatorAddress;
    this.ethUsdAggregatorAddress = bondOption.ethUsdAggregatorAddress;
    this.threeDogDecimals = bondOption.threeDogDecimals;
    this.ethDecimals = bondOption.ethDecimals;
  }

  /**
   * makes isAvailable accessible within Bonds.ts
   * @param networkID
   * @returns boolean
   */
  getAvailability(networkID: NetworkID) {
    return this.isAvailable[networkID];
  }

  getAddressForBond(networkID: NetworkID) {
    return this.networkBondAddressGroup[networkID].bondAddress;
  }

  getContractForBond(networkID: NetworkID, provider: StaticJsonRpcProvider | JsonRpcSigner) {
    const bondAddress = this.getAddressForBond(networkID);
    return new ethers.Contract(bondAddress as string, this.bondContractABI, provider) as EthContract;
  }

  getAddressForReserve(networkID: NetworkID) {
    return this.networkBondAddressGroup[networkID].reserveAddress;
  }

  getContractForReserve(networkID: NetworkID, provider: StaticJsonRpcProvider | JsonRpcSigner) {
    const bondAddress = this.getAddressForReserve(networkID);
    return new ethers.Contract(bondAddress, this.reserveContract, provider) as PairContract;
  }

  // TODO (appleseed): improve this logic
  async getBondReservePrice(networkID: NetworkID, provider: StaticJsonRpcProvider | JsonRpcSigner) {
    let marketPrice: number;
    if (this.isLp) {
      const pairContract = this.getContractForReserve(networkID, provider);
      const reserves = await pairContract.getReserves();
      marketPrice = Number(reserves[1].toString()) / Number(reserves[0].toString()) / Math.pow(10, 9);
    } else {
      marketPrice = await getTokenPriceFromApi('convex-finance');
    }
    return marketPrice;
  }
}

// Generic BondClass we should be using everywhere
// Assumes the token being deposited follows the standard ERC20 spec
export interface StableBondOption extends BondOption {
}

export class StableBond extends Bond {
  readonly isLp = false;
  readonly reserveContract: ethers.ContractInterface;
  readonly displayUnits: string;

  constructor(stableBondOption: StableBondOption) {
    super(BondType.StableAsset, stableBondOption);
    // For stable bonds the display units are the same as the actual token
    this.displayUnits = stableBondOption.displayName;
    this.reserveContract = IERC20Abi; // The Standard ierc20Abi since they're normal tokens
  }

  async getTreasuryBalance(networkID: NetworkID, provider: StaticJsonRpcProvider) {
    let tokenContract = this.getContractForReserve(networkID, provider);
    let tokenAmount = await tokenContract.balanceOf(addressGroup[networkID].TREASURY_ADDRESS);
    return Number(tokenAmount.toString()) / Math.pow(10, 18);
  }
}

// These are special bonds that have different valuation methods
export interface CustomBondOption extends BondOption {
  reserveContract: ethers.ContractInterface;
  bondType: number;
  lpUrl: string;

  customTreasuryBalanceFunction: (
    this: CustomBond,
    networkID: NetworkID,
    provider: StaticJsonRpcProvider,
  ) => Promise<number>;
}

export class CustomBond extends Bond {
  isLp: Boolean;
  reserveContract: ethers.ContractInterface;
  displayUnits: string;
  lpUrl: string;

  getTreasuryBalance(networkID: NetworkID, provider: StaticJsonRpcProvider): Promise<number> {
    throw new Error('Method not implemented.');
  }

  constructor(customBondOption: CustomBondOption) {
    super(customBondOption.bondType, customBondOption);

    this.isLp = customBondOption.bondType === BondType.LP;
    this.lpUrl = customBondOption.lpUrl;
    // For stable bonds the display units are the same as the actual token
    this.displayUnits = customBondOption.displayName;
    this.reserveContract = customBondOption.reserveContract;
    this.getTreasuryBalance = customBondOption.customTreasuryBalanceFunction.bind(this);
  }
}
