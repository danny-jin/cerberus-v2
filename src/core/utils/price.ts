import axios from 'axios';

export async function getTokenPrice(tokenId: string) {
  try {
    const result = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`);
    return result.data[tokenId].usd;
  } catch (e) {
    console.log('coingecko api error: ', e);
  }
}

export async function getDogPrice() {
  try {
    const result = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=cerberusdao&vs_currencies=usd`);
    return result.data['cerberus'].usd;
  } catch (e) {
    console.log('coingecko api error: ', e);
  }
}

export async function getEthPrice() {
  try {
    const result = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`);
    return result.data['ethereum'].usd;
  } catch (e) {
    console.log('coingecko api error: ', e);
  }
}

export async function getShibPrice() {
  try {
    const result = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=shiba-inu&vs_currencies=usd`);
    return result.data['shiba-inu'].usd;
  } catch (e) {
    console.log('coingecko api error: ', e);
  }
}

export async function getFlokiPrice() {
  try {
    const result = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=floki-inu&vs_currencies=usd`);
    return result.data['floki-inu'].usd;
  } catch (e) {
    console.log('coingecko api error: ', e);
  }
}


