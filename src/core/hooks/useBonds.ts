import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { IBondingStateView, IAllBondData, Bond } from '../lib/bond'
import allBonds from '../utils/bond';

const initialBondArray = allBonds;

// Slaps together bond data within the account & bonding states
export const useBonds = (chainID: number) => {
  const bondLoading = useSelector((state: IBondingStateView) => !state.bonding.loading);
  const bondState = useSelector((state: IBondingStateView) => state.bonding);
  const accountBondsState = useSelector((state: IBondingStateView) => state.account.bonds);
  const [bonds, setBonds] = useState<Bond[] | IAllBondData[]>(initialBondArray);

  useEffect(() => {
    let bondDetails: IAllBondData[];
    bondDetails = allBonds
      .flatMap(bond => {
        if (bondState[bond.name] && bondState[bond.name].bondDiscount) {
          return Object.assign(bond, bondState[bond.name]); // Keeps the object type
        }
        return bond;
      })
      .flatMap(bond => {
        if (accountBondsState[bond.name]) {
          return Object.assign(bond, accountBondsState[bond.name]);
        }
        return bond;
      });

    const mostProfitableBonds = bondDetails.concat().sort((a, b) => {
      if (a.getAvailability(chainID) === false) return 1;
      return a['bondDiscount'] > b['bondDiscount'] ? -1 : b['bondDiscount'] > a['bondDiscount'] ? 1 : 0;
    });

    setBonds(mostProfitableBonds);
  }, [bondState, accountBondsState, bondLoading]);

  return {bonds, loading: bondLoading};
}
