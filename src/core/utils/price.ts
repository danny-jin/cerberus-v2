import axios from 'axios';
import { ethers } from 'ethers';

import { Bond } from '../lib/bond';
import { TokenType } from '../interfaces/token';
import { shib, eth, floki } from './bond';

import { ChainLinkAggregatorContract } from '../../typechain';
import { abi as ChainLinkAggregatorContractAbi } from '../../abis/ChainLinkAggregatorContract.json';

export async function getTokenPriceFromApi(tokenId: string) {
  try {
    const result = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`);
    return result.data[tokenId].usd;
  } catch (e) {
    console.log('coingecko api error: ', e);
  }
}

export async function getTokenPriceFromChainLink(provider, bond: Bond) {
  if (bond.tokenType === TokenType.Shiba) {
    const shibaEthAggregatorContract = new ethers.Contract(
      bond.shibaEthAggregatorAddress as string,
      ChainLinkAggregatorContractAbi,
      provider
    ) as ChainLinkAggregatorContract;
    const shibaEtherPrice = await shibaEthAggregatorContract.latestAnswer();
    const ethUsdtAggregatorContract = new ethers.Contract(
      bond.ethUsdAggregatorAddress as string,
      ChainLinkAggregatorContractAbi,
      provider
    ) as ChainLinkAggregatorContract;
    const ethUsdtPrice = await ethUsdtAggregatorContract.latestAnswer();
    return Number(ethers.utils.formatUnits(shibaEtherPrice.mul(ethUsdtPrice), bond.aggregatorDecimals + bond.ethUsdAggregatorDecimals));
  } else {
    const aggregatorContract = new ethers.Contract(
      bond.chainLinkAggregatorAddress as string,
      ChainLinkAggregatorContractAbi,
      provider
    ) as ChainLinkAggregatorContract;
    const latestAnswer = await aggregatorContract.latestAnswer();
    return Number(ethers.utils.formatUnits(latestAnswer, bond.aggregatorDecimals));
  }
}

export async function getDogPrice() {
  try {
    const result = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=cerberusdao&vs_currencies=usd`);
    return result.data['cerberusdao'].usd;
  } catch (e) {
    console.log('coingecko api error: ', e);
  }
}

export async function getEthPrice(provider) {
  return await getTokenPriceFromChainLink(provider, eth);
}

export async function getShibPrice(provider) {
  return await getTokenPriceFromChainLink(provider, shib);
}

export async function getFlokiPrice(provider) {
  return await getTokenPriceFromChainLink(provider, floki);
}


