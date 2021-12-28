import { Paper, Grid, Zoom, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { useSelector } from 'react-redux';
import React, { memo } from 'react';

import {
  TotalValueDepositedGraph,
  MarketValueGraph,
  RiskFreeValueGraph,
  ProtocolOwnedLiquidityGraph,
  OHMStakedGraph,
} from './Graph';
import InfoTooltip from '../../components/InfoTooltip';
import { RootState } from '../../core/store/store';
import { formatCurrency, formatNumber } from '../../core/utils/base';

const Dashboard = memo(() => {

  const marketPrice = useSelector((state: RootState) => state.app.marketPrice);
  const circulatingSupply = useSelector((state: RootState) => state.app.circulatingSupply);
  const marketCap = useSelector((state: RootState) => state.app.marketCap);
  const isAppLoading = useSelector((state: RootState) => !state.app?.marketPrice ?? true);
  const stakingApy = useSelector((state: RootState) => state.app.stakingApy);
  const backingPerThreeDog = useSelector((state: RootState) => state.app.treasuryMarketValue / state.app.circulatingSupply);
  const currentIndex = useSelector((state: RootState) => state.app.currentIndex);

  return (
    <div className="w-full md:px-30 h-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 rounded-md border-goldsand border-3 w-full p-20 mb-20">
        <div className="flex flex-col items-start md:items-center">
          <div className="flex items-center">
            <Typography variant="h6" color="primary" className="text-center">Market Cap</Typography>
          </div>
          {isAppLoading ?
            <Skeleton className="w-full h-30"/> :
            <Typography variant="h5" color="primary" className="text-center">{formatCurrency(marketCap, 0)}</Typography>
          }
        </div>
        <div className="flex flex-col items-start md:items-center">
          <div className="flex items-center">
            <Typography variant="h6" color="primary" className="text-center">3DOG Price</Typography>
          </div>
          {isAppLoading ?
            <Skeleton className="w-full h-30"/> :
            <Typography variant="h5" color="primary" className="text-center">{formatCurrency(marketPrice, 4)}</Typography>
          }
        </div>
        <div className="flex flex-col items-start md:items-center">
          <div className="flex items-center">
            <Typography variant="h6" color="primary" className="text-center">APY</Typography>
          </div>
          {isAppLoading ?
            <Skeleton className="w-full h-30"/> :
            <Typography variant="h5" color="primary" className="text-center">{`${new Intl.NumberFormat('en-US').format(Number(formatNumber(stakingApy * 100, 1)))}%`}</Typography>
          }
        </div>
        <div className="flex flex-col items-start md:items-center">
          <div className="flex items-center">
            <Typography variant="h6" color="primary" className="text-center">Circulating Supply (total)</Typography>
          </div>
          {isAppLoading ?
            <Skeleton className="w-full h-30"/> :
            <Typography variant="h5" color="primary" className="text-center">{new Intl.NumberFormat('en-US').format(parseInt(circulatingSupply))}</Typography>
          }
        </div>
        <div className="flex flex-col items-start md:items-center">
          <div className="flex items-center">
            <Typography variant="h6" color="primary" className="text-center">Backing per 3DOG</Typography>
          </div>
          {isAppLoading ?
            <Skeleton className="w-full h-30"/> :
            <Typography variant="h5" color="primary" className="text-center">{!isNaN(backingPerThreeDog) && formatCurrency(backingPerThreeDog, 4)}</Typography>
          }
        </div>
        <div className="flex flex-col items-start md:items-center">
          <div className="flex items-center">
            <Typography variant="h6" color="primary" className="text-center">Current Index</Typography>
            <div className="ml-5">
              <InfoTooltip message="The current index tracks the amount of s3DOG accumulated since the beginning of staking. Basically, how much s3DOG one would have if they staked and held a single 3DOG from day 1."/>
            </div>
          </div>
          {isAppLoading ?
            <Skeleton className="w-full h-30"/> :
            <Typography variant="h5" color="primary" className="text-center">{`${formatNumber(currentIndex, 2)} 3DOGS`}</Typography>
          }
        </div>
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
