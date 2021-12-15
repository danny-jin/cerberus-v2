import axios from 'axios';

export async function getTokenPrice(tokenId: string) {
  try {
    const result = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`);
    return result.data[tokenId].usd;
  } catch (e) {
    console.log('coingecko api error: ', e);
  }
}
