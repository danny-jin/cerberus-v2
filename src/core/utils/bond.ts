import { StaticJsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers';
import { ethers, BigNumberish } from 'ethers';

import { ShibaIcon, DogWethIcon, WethIcon, FlokiIcon } from '../../components/CustomSvg';
import { getDogPrice, getEthPrice, getShibPrice, getFlokiPrice } from './price';
import { NetworkID } from '../interfaces/base';
import { CustomBond, BondType } from '../lib/bond';
import { addressGroup } from '../data/address';

import { BondCalculatorContract, RedeemHelper } from '../../typechain';
import { abi as BondCalculatorContractAbi } from '../../abis/BondCalculatorContract.json';
import { abi as BondDogEthContract } from '../../abis/OhmEthContract.json';
import { abi as ReserveDogEthContract } from '../../abis/ReserveDogEthContract.json';
import { abi as ShibBondContract } from '../../abis/ShibBondContract.json';
import { abi as FlokiBondContract } from '../../abis/FlokiBondContract.json';
import { abi as EthBondContract } from '../../abis/EthContract.json';
import { abi as IERC20Abi } from '../../abis/IERC20.json';
import { abi as RedeemHelperABI } from '../../abis/RedeemHelper.json';

export function getBondCalculatorContract(networkID: NetworkID, provider: StaticJsonRpcProvider) {
  return new ethers.Contract(
    addressGroup[networkID].BONDING_CALCULATOR_ADDRESS as string,
    BondCalculatorContractAbi,
    provider,
  ) as BondCalculatorContract;
}

export function getSpecialBondCalculatorContract(networkID: NetworkID, provider: StaticJsonRpcProvider) {
  return new ethers.Contract(
    addressGroup[networkID].SPECIALBONDINGCALC_ADDRESS as string,
    BondCalculatorContractAbi,
    provider,
  ) as BondCalculatorContract;
}

export function getRedeemHelperContract({networkID, provider,}: {
  networkID: number; provider: StaticJsonRpcProvider | JsonRpcSigner;
}) {
  return new ethers.Contract(
    addressGroup[networkID].REDEEM_HELPER_ADDRESS as string,
    RedeemHelperABI,
    provider,
  ) as RedeemHelper;
}

export const shib = new CustomBond({
  name: 'shib',
  displayName: 'SHIB',
  lpUrl: '',
  bondType: BondType.StableAsset,
  bondToken: 'SHIB',
  isAvailable: {[NetworkID.Mainnet]: true, [NetworkID.Testnet]: true},
  bondIconSvg: ShibaIcon,
  bondContractABI: ShibBondContract,
  reserveContract: IERC20Abi, // The Standard IERC20Abi since they're normal tokens
  networkBondAddressGroup: {
    [NetworkID.Mainnet]: {
      bondAddress: '0x5F50d0f427228F48665fB790685c450328995C0D',
      reserveAddress: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
    },
    [NetworkID.Testnet]: {
      bondAddress: '0xca7b90f8158A4FAA606952c023596EE6d322bcf0',
      reserveAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
    },
  },
  customTreasuryBalanceFunction: async function (this: CustomBond, networkID, provider) {
    let shibPrice: BigNumberish = await getShibPrice();
    shibPrice = Number(shibPrice.toString()) / Math.pow(10, 8);
    const token = this.getContractForReserve(networkID, provider);
    let shibAmount: BigNumberish = await token.balanceOf(addressGroup[networkID].TREASURY_ADDRESS);
    shibAmount = Number(shibAmount.toString()) / Math.pow(10, 18);
    return shibAmount * shibPrice;
  },
});

export const floki = new CustomBond({
  name: 'floki',
  displayName: 'FLOKI',
  lpUrl: '',
  bondType: BondType.StableAsset,
  bondToken: 'FLOKI',
  isAvailable: {[NetworkID.Mainnet]: true, [NetworkID.Testnet]: true},
  bondIconSvg: FlokiIcon,
  bondContractABI: FlokiBondContract,
  reserveContract: IERC20Abi, // The Standard IERC20Abi since they're normal tokens
  networkBondAddressGroup: {
    [NetworkID.Mainnet]: {
      bondAddress: '0xf0c2b0eC587155abE978AE47705f0C619F44Bc65',
      reserveAddress: '0x43F11C02439E2736800433B4594994BD43CD066D',
    },
    [NetworkID.Testnet]: {
      bondAddress: '0xca7b90f8158A4FAA606952c023596EE6d322bcf0',
      reserveAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
    },
  },
  customTreasuryBalanceFunction: async function (this: CustomBond, networkID, provider) {
    let flokiPrice: BigNumberish = await getFlokiPrice();
    flokiPrice = Number(flokiPrice.toString()) / Math.pow(10, 8);
    const token = this.getContractForReserve(networkID, provider);
    let flokiAmount: BigNumberish = await token.balanceOf(addressGroup[networkID].TREASURY_ADDRESS);
    flokiAmount = Number(flokiAmount.toString()) / Math.pow(10, 18);
    return flokiAmount * flokiPrice;
  },
});

export const eth = new CustomBond({
  name: 'eth',
  displayName: 'wETH',
  lpUrl: '',
  bondType: BondType.StableAsset,
  bondToken: 'wETH',
  isAvailable: {[NetworkID.Mainnet]: true, [NetworkID.Testnet]: false},
  bondIconSvg: WethIcon,
  bondContractABI: EthBondContract,
  reserveContract: IERC20Abi, // The Standard IERC20Abi since they're normal tokens
  networkBondAddressGroup: {
    [NetworkID.Mainnet]: {
      bondAddress: '0x30F5039447B8AEf529DB99324896b14d453D85Fa',
      reserveAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    },
    [NetworkID.Testnet]: {
      bondAddress: '0xca7b90f8158A4FAA606952c023596EE6d322bcf0',
      reserveAddress: '0xc778417e063141139fce010982780140aa0cd5ab',
    },
  },
  customTreasuryBalanceFunction: async function (this: CustomBond, networkID, provider) {
    let ethPrice = await getEthPrice();
    const token = this.getContractForReserve(networkID, provider);
    let ethAmount: BigNumberish = await token.balanceOf(addressGroup[networkID].TREASURY_ADDRESS);
    ethAmount = Number(ethAmount.toString()) / Math.pow(10, 18);
    return ethAmount * ethPrice;
  },
});

export const dog_eth = new CustomBond({
  name: 'dog_eth_lp',
  displayName: '3DOG-wETH LP',
  bondToken: 'wETH',
  isAvailable: {[NetworkID.Mainnet]: true, [NetworkID.Testnet]: true},
  bondIconSvg: DogWethIcon,
  bondContractABI: BondDogEthContract,
  reserveContract: ReserveDogEthContract,
  networkBondAddressGroup: {
    [NetworkID.Mainnet]: {
      bondAddress: '0xd2E0BD64B3e6fbc4d09f9a11e5852bf9A46A6731',
      reserveAddress: '0xB5B6C3816C66Fa6BC5b189F49e5b088E2dE5082a',
    },
    [NetworkID.Testnet]: {
      bondAddress: '0x39B8E79de8201C46cCBad64767B7208d9C41A9dB',
      reserveAddress: '0xB5B6C3816C66Fa6BC5b189F49e5b088E2dE5082a',
    },
  },
  bondType: BondType.LP,
  lpUrl:
    'https://app.uniswap.org/#/add/v2/ETH/0x8a14897eA5F668f36671678593fAe44Ae23B39FB',
  customTreasuryBalanceFunction: async function (this: CustomBond, networkID, provider) {
    if (networkID === NetworkID.Mainnet) {
      const token = this.getContractForReserve(networkID, provider);
      const tokenAmount = await token.balanceOf(addressGroup[networkID].TREASURY_ADDRESS);
      const lpTokenSupply = await token.totalSupply()
      let reserves = await token.getReserves()
      let reserves0 = Number(reserves[0].toString())
      let reserves1 = Number(reserves[1].toString())
      let dPrice = await getDogPrice()
      let wethPrice = await getEthPrice()
      let lpValue = (dPrice * (reserves0 / Math.pow(10, 9))) + ((wethPrice * reserves1 / Math.pow(10, 18)))
      let lpTokenValue = lpValue / Number(lpTokenSupply.toString()) * Math.pow(10, 18)
      const lpSupply = Number(tokenAmount.toString()) / Math.pow(10, 18)
      return lpTokenValue * lpSupply;

    } else {
      const token = this.getContractForReserve(networkID, provider);
      const tokenAddress = this.getAddressForReserve(networkID);
      const bondCalculator = getBondCalculatorContract(networkID, provider);
      const tokenAmount = await token.balanceOf(addressGroup[networkID].TREASURY_ADDRESS);
      const valuation = await bondCalculator.valuation(tokenAddress, tokenAmount);
      const markdown = await bondCalculator.markdown(tokenAddress);
      return (Number(valuation.toString()) / Math.pow(10, 9)) * (Number(markdown.toString()) / Math.pow(10, 18));
    }
  },
});

export const allBonds = [shib, dog_eth, floki, eth];
export const allBondsMap = allBonds.reduce((prevVal, bond) => {
  return {...prevVal, [bond.name]: bond};
}, {});

export default allBonds;
