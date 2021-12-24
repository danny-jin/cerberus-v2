import { InputAdornment, OutlinedInput, Slider, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';

import { BaseInfo, BaseInfoKey } from '../../core/interfaces/base';
import { RootState } from '../../core/store/store';
import { formatNumber } from '../../core/utils/base';
import InfoTooltip from '../../components/InfoTooltip';
import { Skeleton } from '@material-ui/lab';

const defaultNetworkBaseInfos: BaseInfo[] = [
  {
    name: '3DOG Price',
    value: null,
    key: BaseInfoKey.ThreeDogPrice
  },
  {
    name: 'Current APY',
    value: null,
    key: BaseInfoKey.Apy
  },
  {
    name: '3DOGs Balancce',
    value: null,
    key: BaseInfoKey.ThreeDogsBalance,
  }
]

const Calculator = () => {

  const [networkBaseInfos, setNetworkBaseInfos] = useState(defaultNetworkBaseInfos);

  const isAppLoading = useSelector((state: RootState) => state.app.loading);
  const marketPrice = useSelector((state: RootState) => state.app.marketPrice);
  const stakingApy = useSelector((state: RootState) => state.app.stakingApy);
  const sOhmBalance = useSelector((state: RootState) => state.account.balances && state.account.balances.sOhm);

  let formattedStakingApy = formatNumber(stakingApy * 100, 0);
  let formattedsOhmBalance = formatNumber(Number(sOhmBalance), 0);
  let formattedMarketPrice = formatNumber(marketPrice, 4);

  const [sOhmAmount, setsOhmAmount] = useState(formattedsOhmBalance);
  const [rewardYield, setRewardYield] = useState(formattedStakingApy);
  const [priceAtPurchase, setPriceAtPurchase] = useState(formattedMarketPrice);
  const [futureMarketPrice, setFutureMarketPrice] = useState(formattedMarketPrice);
  const [days, setDays] = useState(30);

  const [rewardsEstimation, setRewardsEstimation] = useState('0');
  const [potentialReturn, setPotentialReturn] = useState('0');

  const calcInitialInvestment = () => {
    const sOhm = Number(sOhmAmount) || 0;
    const price = parseFloat(priceAtPurchase) || 0;
    const amount = sOhm * price;
    return formatNumber(amount, 2);
  };

  const [initialInvestment, setInitialInvestment] = useState(calcInitialInvestment());

  const calcCurrentWealth = () => {
    const sOhm = Number(sOhmAmount) || 0;
    const price = parseFloat(formattedMarketPrice);
    const amount = sOhm * price;
    return formatNumber(amount, 2);
  };

  const calcNewBalance = () => {
    let value = parseFloat(rewardYield) / 100;
    value = Math.pow(value - 1, 1 / (365 * 3)) - 1 || 0;
    let balance = Number(sOhmAmount) || 0;
    for (let i = 0; i < days * 3; i++) {
      balance += balance * value;
    }
    return balance;
  };

  useEffect(() => {
    const newInitialInvestment = calcInitialInvestment();
    setInitialInvestment(newInitialInvestment);
  }, [sOhmAmount, priceAtPurchase]);

  useEffect(() => {
    const newBalance = calcNewBalance();
    setRewardsEstimation(formatNumber(newBalance, 2));
    const newPotentialReturn = newBalance * (parseFloat(futureMarketPrice) || 0);
    setPotentialReturn(formatNumber(newPotentialReturn, 2));
  }, [days, rewardYield, futureMarketPrice, sOhmAmount]);

  useEffect(() => {
    const infos = defaultNetworkBaseInfos;
    infos.forEach((info: BaseInfo) => {
      switch (info.key) {
        case BaseInfoKey.ThreeDogPrice:
          if (formattedMarketPrice) {
            info.value = formattedMarketPrice;
          }
          break;
        case BaseInfoKey.Apy:
          if (formattedStakingApy) {
            info.value = `${new Intl.NumberFormat('en-US').format(Number(formattedStakingApy))}%`;
          }
          break;
        case BaseInfoKey.ThreeDogsBalance:
          if (formattedsOhmBalance) {
            info.value = new Intl.NumberFormat('en-US').format(Number(formattedsOhmBalance));
          }
          break;
        default:
          break;
      }
    });
    setNetworkBaseInfos([...infos]);
  }, [marketPrice, stakingApy, sOhmBalance]);

  return (
    <div className="flex justify-center w-full min-h-full">
      <div className="rounded-2xl border-goldsand border-3 w-full md:w-800 p-15 sm:p-30">
        <div className="flex flex-col mb-20">
          <Typography variant="h5" color="primary" className="font-bold mt-20 mb-5">Calculator</Typography>
          <Typography variant="body2" color="primary" className="font-bold leading-2 mb-5">Estimate your returns</Typography>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {
            networkBaseInfos.map((info: BaseInfo, index) => {
              return (
                index < 3 && (
                  <div className="flex flex-col justify-between items-start md:items-center mt-20" key={index}>
                    <div className="flex items-center ">
                      <Typography variant="h5"
                                  className="text-center font-bold text-white-600">{info.name}</Typography>
                      {info?.hasTooltip &&
                      <div className="ml-5">
                        <InfoTooltip message={info?.message || ''}/>
                      </div>
                      }
                    </div>
                    {!info.value ?
                      <Skeleton className="w-full h-30 my-25"/> :
                      <Typography variant="h5" color="primary"
                                  className="text-center font-bold my-25">{info.value}</Typography>
                    }
                  </div>)
              )
            })
          }
        </div>
        <div>
          <div>
            <div className="mt-25 flex flex-wrap w-full">
              <div className="w-full md:w-6/12 p-10">
                <div className="">
                  <Typography variant="h6" color="primary" className="ml-5 mb-5">3DOGs Amount</Typography>
                  <OutlinedInput
                    type="number"
                    placeholder="0"
                    className="w-full bg-white-200 border border-white-200 rounded-md text-white outline-0 cursor-pointer"
                    value={sOhmAmount || ''}
                    onChange={e => setsOhmAmount(e.target.value)}
                    labelWidth={0}
                    endAdornment={
                      <InputAdornment position="end">
                        <div onClick={() => setsOhmAmount(formattedsOhmBalance)}
                             className="font-bold text-15 text-white px-20 py-15">
                          <p>Max</p>
                        </div>
                      </InputAdornment>
                    }
                  />
                </div>
              </div>
              <div className="w-full md:w-6/12 p-10">
                <div className="">
                  <Typography variant="h6" color="primary" className="ml-5 mb-5">APY (%)</Typography>
                  <OutlinedInput
                    type="number"
                    placeholder="Amount"
                    className="w-full bg-white-200 border border-white-200 rounded-md text-white outline-0 cursor-pointer"
                    value={rewardYield || ''}
                    onChange={e => setRewardYield(e.target.value)}
                    labelWidth={0}
                    endAdornment={
                      <InputAdornment position="end">
                        <div onClick={() => setRewardYield(formattedStakingApy)}
                             className="font-bold text-15 text-white px-20 py-15">
                          <p>Current</p>
                        </div>
                      </InputAdornment>
                    }
                  />
                </div>
              </div>
              <div className="w-full md:w-6/12 p-10">
                <div className="">
                  <Typography variant="h6" color="primary" className="ml-5 mb-5">3DOG price at purchase ($)</Typography>
                  <OutlinedInput
                    type="number"
                    placeholder="0"
                    className="w-full bg-white-200 border border-white-200 text-white rounded-md outline-0 cursor-pointer"
                    value={priceAtPurchase || ''}
                    onChange={e => setPriceAtPurchase(e.target.value)}
                    labelWidth={0}
                    endAdornment={
                      <InputAdornment position="end">
                        <div onClick={() => setPriceAtPurchase(marketPrice)}
                             className="font-bold text-15 text-white px-20 py-15">
                          <p>Current</p>
                        </div>
                      </InputAdornment>
                    }
                  />
                </div>
              </div>
              <div className="w-full md:w-6/12 p-10">
                <div className="">
                  <Typography variant="h6" color="primary" className="ml-5 mb-5">Future 3DOG market price ($)</Typography>
                  <OutlinedInput
                    type="number"
                    placeholder="0"
                    className="w-full bg-white-200 border border-white-200 rounded-md outline-0 text-white cursor-pointer pr-15"
                    value={futureMarketPrice || ''}
                    onChange={e => setFutureMarketPrice(e.target.value)}
                    labelWidth={0}
                    endAdornment={
                      <InputAdornment position="end">
                        <div onClick={() => setFutureMarketPrice(marketPrice)}
                             className="font-bold text-15 text-white px-20 py-10">
                          <p>Current</p>
                        </div>
                      </InputAdornment>
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-30">
            <Typography variant="h6" color="primary" className="ml-5 mb-5">{`${days} day${days > 1 ? 's' : ''}`}</Typography>
            <Slider className="w-full" min={1} max={365} value={days}
                    onChange={(e, newValue: any) => setDays(newValue)}/>
          </div>
          <div className="text-20 m-auto px-5 mt-30">
            <div className="mb-15">
              <Typography variant="body1" color="primary" className="mb-10">Your initial investment</Typography>
              {
                isAppLoading ? <Skeleton className="w-80"/> : <Typography variant="body1" color="primary">${new Intl.NumberFormat("en-US").format(Number(initialInvestment))}</Typography>
              }
            </div>
            <div className="mb-15">
              <Typography variant="body1" color="primary" className="mb-10">Current wealth</Typography>
              {
                isAppLoading ? <Skeleton className="w-80"/> : <Typography variant="body1" color="primary">${new Intl.NumberFormat("en-US").format(Number(calcCurrentWealth()))}</Typography>
              }
            </div>
            <div className="mb-15">
              <Typography variant="body1" color="primary" className="mb-10">3DOG rewards estimation</Typography>
              {
                isAppLoading ? <Skeleton className="w-80"/> : <Typography variant="body1" color="primary">{new Intl.NumberFormat("en-US").format(Number(rewardsEstimation))} 3DOG</Typography>
              }
            </div>
            <div className="mb-15">
              <Typography variant="body1" color="primary" className="mb-10">Potential return</Typography>
              {
                isAppLoading ? <Skeleton className="w-80"/> : <Typography variant="body1" color="primary">${new Intl.NumberFormat("en-US").format(Number(potentialReturn))}</Typography>
              }
            </div>
            <div className="mb-15">
              <Typography variant="body1" color="primary" className="mb-10">Potential number of lambos</Typography>
              {
                isAppLoading ? <Skeleton className="w-80"/> : <Typography variant="body1" color="primary">{Math.floor(Number(potentialReturn) / 220000)}</Typography>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calculator;
