import isEmpty from "lodash/isEmpty";
import { Skeleton } from '@material-ui/lab';
import { Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';

import BondItem from './BondItem';
import ClaimBonds from './ClaimBonds';
import InfoTooltip from '../../components/InfoTooltip';
import { RootState } from '../../core/store/store';
import { BaseInfo, BaseInfoKey } from '../../core/interfaces/base';
import { useWeb3Context } from '../../core/hooks/web3Context';
import { useBonds } from '../../core/hooks/useBonds';
import { formatNumber, formatCurrency } from '../../core/utils/base';

const defaultNetworkBaseInfos: BaseInfo[] = [
  {
    name: 'Treasury Balance',
    value: null,
    key: BaseInfoKey.TreasuryBalance
  },
  {
    name: '3DOG Price',
    value: null,
    key: BaseInfoKey.ThreeDogPrice
  },
]

const Bond = () => {
  const {chainID} = useWeb3Context();
  const {bonds} = useBonds(chainID)
  const isMobile = false;

  const appData = useSelector((state: RootState) => state.app);
  const accountData = useSelector((state: RootState) => state.account);
  const marketPrice = useSelector((state: RootState) => state.app.marketPrice);
  const treasuryBalance = useSelector((state: RootState) => state.app.treasuryMarketValue);
  const isAccountLoading = useSelector((state: RootState) => state.account.loading);
  const accountBonds = useSelector((state: RootState) => {
    const withInterestDue = [];
    for (const bond in state.account.bonds) {
      if (state.account.bonds[bond].interestDue > 0) {
        withInterestDue.push(state.account.bonds[bond]);
      }
    }
    return withInterestDue;
  });

  const [networkBaseInfos, setNetworkBaseInfos] = useState(defaultNetworkBaseInfos);

  let formattedMarketPrice = formatCurrency(marketPrice, 4);
  let formattedTreasuryBalance = formatCurrency(Number(formatNumber(treasuryBalance, 4)));

  useEffect(() => {
    const infos = defaultNetworkBaseInfos;
    infos.forEach((info: BaseInfo) => {
      switch (info.key) {
        case BaseInfoKey.TreasuryBalance    :
          if (formattedTreasuryBalance) {
            info.value = formattedTreasuryBalance;
          }
          break;
        case BaseInfoKey.ThreeDogPrice:
          if (formattedMarketPrice) {
            info.value = formattedMarketPrice;
          }
          break;
        default:
          break;
      }
    });
    setNetworkBaseInfos([...infos]);
  }, [appData, accountData]);

  return (
    <div className="flex flex-col items-center justify-center">
      {!isAccountLoading && !isEmpty(accountBonds) && <div className="w-full md:w-835 mb-20"><ClaimBonds activeBonds={accountBonds} /></div>}
      <div className="flex md:justify-center items-center w-full h-full md:flex-row flex-col">
        <div className="rounded-lg border-goldsand border-3 w-full md:w-835 px-30 py-20 md:mb-0 mb-30">
          <div className="w-full min-h-35">
            <Typography variant="h5" className="font-bold text-white leading-10 tracking-wide">Bond (1,1)</Typography>
          </div>
          <div className="grid grid-cols-2 mb-30">
            {
              networkBaseInfos.map((info: BaseInfo, index) => {
                return (
                  index < 3 && (
                    <div className="flex flex-col justify-around items-center" key={index}>
                      <div className="flex items-center">
                        <Typography variant="h5"
                                    className="text-center font-semibold text-white">{info.name}</Typography>
                        {info?.hasTooltip &&
                        <div className="ml-30">
                          <InfoTooltip message={info?.message || ''}/>
                        </div>
                        }
                      </div>
                      {!info.value ?
                        <Skeleton className="w-1/4 h-30"/> :
                        <Typography variant="h5" color="primary"
                                    className="text-center font-bold">{info.value}</Typography>
                      }
                    </div>)
                )
              })}
          </div>
          <div className={`grid grid-rows-${bonds.length} text-white mb-10`}>
            <div className="md:grid grid-cols-12 hidden flex items-end">
              <div className="flex items-center col-span-2 justify-center">
                <Typography variant="h6" className="col-span-2 text-center text-white-600 p-15"></Typography>
              </div>
              <div className="flex items-center col-span-2 justify-start">
                <Typography variant="h6" className="col-span-2 text-center text-white-600 p-15">Bond</Typography>
              </div>
              <div className="flex items-center">
                <Typography variant="h6" className="text-white-600 p-15">Price</Typography>
              </div>
              <div className="col-span-3 ml-20 flex items-center">
                <Typography variant="h6" className="text-white-600 p-15">ROI</Typography>
              </div>
              <div className="col-span-2 flex justify-end items-center">
                <Typography variant="h6" className="text-white-600 p-15">Purchased</Typography>
              </div>
              <div className="col-span-2 flex items-center">
                <Typography variant="h6" className="text-white-600 p-15"/>
              </div>
            </div>
            {bonds.map((bond: any, index: number) => (
              <BondItem bond={bond} isMobile={isMobile} key={index}/>
            ))}
          </div>
        </div>
        {bonds.map((bond: any, index: number) => (
          <BondItem bond={bond} isMobile={!isMobile} key={index}/>
        ))}
      </div>
    </div>
  )
}

export default Bond;
