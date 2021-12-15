import { Paper, Grid, Zoom } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { useSelector } from 'react-redux';
import React, { useEffect, useState, memo } from 'react';

import {
  TotalValueDepositedGraph,
  MarketValueGraph,
  RiskFreeValueGraph,
  ProtocolOwnedLiquidityGraph,
  OHMStakedGraph,
} from './Graph';
import InfoTooltip from '../../components/InfoTooltip';
import { RootState } from '../../core/store/store';
import { BaseInfo, BaseInfoKey } from '../../core/interfaces/base';
import { formatCurrency, formatNumber } from '../../core/utils/base';
import { defaultNetworkBaseInfos } from '../../core/data/dashboard';

const Dashboard = memo(() => {

  const appData = useSelector((state: RootState) => state.app);
  const [networkBaseInfos, setNetworkBaseInfos] = useState(defaultNetworkBaseInfos);

  useEffect(() => {
    if (!appData.currentIndex) {
      return;
    }
    const infos = defaultNetworkBaseInfos;
    infos.forEach((info: BaseInfo) => {
      switch (info.key) {
        case BaseInfoKey.MarketCap:
          info.value = formatCurrency(appData.marketCap, 0);
          break;
        case BaseInfoKey.ThreeDogPrice:
          info.value = formatCurrency(appData.marketPrice, 4);
          break;
        case BaseInfoKey.Apy:
          info.value = `${new Intl.NumberFormat('en-US').format(Number(formatNumber(appData.stakingApy * 100, 1)))}%`;
          break;
        case BaseInfoKey.CirculatingSupply:
          info.value = new Intl.NumberFormat('en-US').format(parseInt(appData.circulatingSupply));
          break;
        case BaseInfoKey.BackingPerThreeDog:
          info.value = formatCurrency(appData.treasuryMarketValue / appData.circulatingSupply, 4);
          break;
        case BaseInfoKey.CurrentIndex:
          info.value = `${formatNumber(appData.currentIndex, 2)} 3DOGS`;
          break;
        default:
          break;
      }
    });
    setNetworkBaseInfos(infos);
  }, [appData]);

  return (
    <div className="w-full md:px-30 h-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 rounded-md border-goldsand border-3 w-full p-20 mb-20">
        {
          networkBaseInfos.map((info: BaseInfo, index) => {
            return (
              <div className="flex flex-col items-start md:items-center" key={index}>
                <div className="flex items-center">
                  <span className="text-16 text-center font-semibold text-white">{info.name}</span>
                  {info?.hasTooltip &&
                  <div className="ml-5">
                    <InfoTooltip message={info?.message || ''}/>
                  </div>
                  }
                </div>
                {!info.value ?
                  <Skeleton className="w-full h-30"/> :
                  <span className="text-18 text-center font-bold text-white">{info.value}</span>
                }
              </div>
            )
          })
        }
      </div>
      <div className="pb-20">
        <Zoom in={true}>
          <Grid container spacing={2} className="flex items-center h-full">
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="flex justify-evenly flex-wrap bg-transparent rounded-xl border-goldsand border-3 py-20 min-w-300 h-370">
                <TotalValueDepositedGraph/>
              </Paper>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="flex justify-evenly flex-wrap bg-transparent rounded-xl border-goldsand border-3 py-20 min-w-300 h-370">
                <MarketValueGraph/>
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="flex justify-evenly flex-wrap bg-transparent rounded-xl border-goldsand border-3 py-20 min-w-300 h-370">
                <RiskFreeValueGraph/>
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="flex justify-evenly flex-wrap bg-transparent rounded-xl border-goldsand border-3 py-20 h-370">
                <ProtocolOwnedLiquidityGraph/>
              </Paper>
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Paper className="flex justify-evenly flex-wrap bg-transparent rounded-xl border-goldsand border-3 py-20 h-370">
                <OHMStakedGraph/>
              </Paper>
            </Grid>
          </Grid>
        </Zoom>
      </div>
    </div>
  )
})

export default Dashboard;
