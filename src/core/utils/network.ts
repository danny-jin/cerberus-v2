import { BLOCK_RATE_SECONDS } from '../data/base';

export function secondsUntilBlock(startBlock: number, endBlock: number) {
  return BLOCK_RATE_SECONDS * (endBlock - startBlock);
}
