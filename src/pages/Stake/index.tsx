import { Skeleton } from '@material-ui/lab';
import { Tabs, Tab, Typography } from '@material-ui/core';
import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';

import RebaseTimer from '../../components/RebaseTimer';
import InfoTooltip from '../../components/InfoTooltip';
import { useWeb3Context } from '../../hooks/web3Context';
import { RootState } from '../../core/store/store';
import { BaseInfo, BaseInfoKey } from '../../core/interfaces/base';
import { formatNumber } from '../../core/utils/base';

const defaultNetworkBaseInfos: BaseInfo[] = [
  {
    name: 'APY',
    value: null,
    key: BaseInfoKey.Apy
  },
  {
    name: 'Total Value Deposited',
    value: null,
    key: BaseInfoKey.TotalValueDeposited
  },
  {
    name: 'Current Index',
    value: null,
    key: BaseInfoKey.CurrentIndex,
  },
  {
    name: 'Unstaked Balance',
    value: null,
    key: BaseInfoKey.UnStakedBalance
  },
  {
    name: 'Staked Balance',
    value: null,
    key: BaseInfoKey.StakedBalance
  },
  {
    name: 'Next Reward Amount',
    value: null,
    key: BaseInfoKey.NextRewardAmount,
  },
  {
    name: 'Next Reward Yield',
    value: null,
    key: BaseInfoKey.NextRewardYield,
  },
  {
    name: 'ROI (5-Day Rate)',
    value: null,
    key: BaseInfoKey.FiveDaysRate,
  },
];

const Stake = () => {

  const {address, connect, disconnect, connected, chainID} = useWeb3Context();
  const [networkBaseInfos, setNetworkBaseInfos] = useState(defaultNetworkBaseInfos);
  const [isUnStaked, setIsUnStaked] = useState(0);

  const appData = useSelector((state: RootState) => state.app);
  const accountData = useSelector((state: RootState) => state.account);
  const pendingTransactions = useSelector((state: RootState) => {
    return state.pendingTx;
  });

  const connectWallet = () => {
    if (connected) {
      disconnect();
    } else {
      connect();
    }
  };

  const hasAllowance = useCallback(
    token => {
      if (token === 'ohm') return accountData.staking.ohmStake > 0;
      if (token === 'sOhm') return accountData.staking.ohmUnStake > 0;
      return 0;
    },
    [accountData.staking.ohmStake, accountData.staking.ohmUnStake],
  );

  const isAllowanceDataLoading = (accountData.staking.ohmStake == null && isUnStaked === 0) || (accountData.staking.ohmUnStake == null && isUnStaked === 1);

  const toggleStake = (event, value) => {
    setIsUnStaked(value);
  };

  useEffect(() => {
    if (!appData.currentIndex) {
      return;
    }
    const stakedBalance = Number(
      [accountData.balances.sOhm]
        .filter(Boolean)
        .map(balance => Number(balance))
        .reduce((a, b) => a + b, 0)
        .toFixed(4),
    );
    const stakingRebasePercentage = formatNumber(appData.stakingRebase * 100, 4);
    const nextRewardValue = formatNumber(Number(stakingRebasePercentage) / 100 * stakedBalance, 4);
    const infos = defaultNetworkBaseInfos;
    infos.forEach((info: BaseInfo) => {
      switch (info.key) {
        case BaseInfoKey.Apy:
          info.value = `${new Intl.NumberFormat('en-US').format(Number(formatNumber(appData.stakingApy * 100, 1)))}%`;
          break;
        case BaseInfoKey.TotalValueDeposited:
          info.value = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          }).format(appData.stakingTvl)
          break;
        case BaseInfoKey.CurrentIndex:
          info.value = `${formatNumber(appData.currentIndex, 2)} 3DOGS`;
          break;
        case BaseInfoKey.UnStakedBalance:
          if (!accountData.balances.ohm) {
            info.value = '';
          } else {
            // @ts-ignore
            info.value = `${new Intl.NumberFormat('en-US').format(formatNumber(Number(accountData.balances.ohm), 4))} 3DOGs`;
          }
          break;
        case BaseInfoKey.StakedBalance:
          info.value = `${new Intl.NumberFormat('en-US').format(stakedBalance)} 3DOGs`;
          break;
        case BaseInfoKey.NextRewardAmount:
          info.value = `${new Intl.NumberFormat('en-US').format(Number(nextRewardValue))} 3DOGs`;
          break;
        case BaseInfoKey.NextRewardYield:
          info.value = `${stakingRebasePercentage}%`;
          break;
        case BaseInfoKey.FiveDaysRate:
          info.value = `${formatNumber(appData.fiveDaysRate * 100, 4)}%`;
          break;
        default:
          break;
      }
    });
    setNetworkBaseInfos([...infos]);
  }, [appData, accountData]);

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="rounded-2xl border-goldsand border-3 w-full md:w-800 p-15 sm:p-30">
        <div className="flex">
          <Typography variant="h5" color="primary" className="font-semibold">Single Stake (🐶,🐶,🐶)</Typography>
        </div>
        <div className="flex">
          <RebaseTimer></RebaseTimer>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full mt-20 mb-40">
          {
            networkBaseInfos.map((info: BaseInfo, index) => {
              return (
                index < 3 && (<div className="flex flex-col justify-end items-start md:items-center" key={index}>
                  <div className="flex items-center">
                    <Typography variant="h5" color="primary" className="text-center">{info.name}</Typography>
                    {info?.hasTooltip &&
                    <div className="ml-5">
                      <InfoTooltip message={info?.message || ''}/>
                    </div>
                    }
                  </div>
                  {!info.value ?
                    <Skeleton className="w-full h-30"/> :
                    <Typography variant="h6" color="primary" className="text-center font-bold">{info.value}</Typography>
                  }
                </div>)
              )
            })
          }
        </div>
        {
          !address ? (
            <div className="flex flex-col items-center">
              <button
                className="rounded-md bg-gradient-to-r from-paarl to-corvette min-w-240 max-w-300 h-40 text-20 text-white font-bold"
                onClick={() => connectWallet()}>
                {connected ? 'Disconnect' : 'Connect Wallet'}
              </button>
              <div className="flex justify-center mt-15">
                <Typography variant="h6" color="primary" className="font-semibold">Connect your wallet to stake 3DOG</Typography>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="flex justify-center">
                <Tabs
                  centered
                  value={isUnStaked}
                  textColor="primary"
                  indicatorColor="primary"
                  onChange={toggleStake}
                  aria-label="stake tabs"
                >
                  <Tab label="Stake" id="simple-tab-0"/>
                  <Tab label="UnStake" id="simple-tab-1"/>
                </Tabs>
              </div>
              <div className="flex items-center">

              </div>
              <div className="flex flex-col">
                {
                  networkBaseInfos.map((info: BaseInfo, index) => {
                    return (
                      index >= 3 && (<div className="flex items-center justify-between mb-10" key={index}>
                        <Typography variant="body1" color="primary" className="text-center font-medium">{info.name}</Typography>
                        {!info.value ?
                          <Skeleton className="w-80"/> :
                          <Typography variant="body1" color="primary" className="text-center font-medium">{info.value}</Typography>
                        }
                      </div>)
                    )
                  })
                }
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default Stake;
