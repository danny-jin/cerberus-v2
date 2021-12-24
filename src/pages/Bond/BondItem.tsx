import { SvgIcon, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';

import BondLogo from './BondLogo';
import { ArrowUpIcon } from '../../components/CustomSvg';
import { RootState } from '../../core/store/store';
import { calcBondDetails } from '../../core/store/slices/bondSlice';
import { useWeb3Context } from '../../core/hooks/web3Context';
import { formatCurrency, formatNumber } from '../../core/utils/base';
import { SECONDS_TO_REFRESH } from '../../core/data/base';

const BondItem = ({bond, isMobile}, key) => {
  const dispatch = useDispatch();
  const {provider, chainID} = useWeb3Context();
  const [secondsToRefresh, setSecondsToRefresh] = useState(SECONDS_TO_REFRESH);

  const isBondLoading = useSelector((state: RootState) => state.bonding.loading ?? true);

  useEffect(() => {
    let interval = null;
    if (secondsToRefresh > 0) {
      interval = setInterval(() => {
        setSecondsToRefresh(secondsToRefresh => secondsToRefresh - 1);
      }, 1000);
    } else {
      clearInterval(interval);
      dispatch(calcBondDetails({bond, value: '', provider, networkID: chainID}));
      setSecondsToRefresh(SECONDS_TO_REFRESH);
    }
    return () => clearInterval(interval);
  }, [secondsToRefresh]);

  useEffect(() => {
    dispatch(calcBondDetails({bond, value: '', provider, networkID: chainID}));
  }, []);

  if (!isMobile) {
    return (
      <div className="md:grid grid-cols-12 hidden" key={key}>
        <div className="col-span-2 py-15 flex justify-end items-center">
          <BondLogo bond={bond}/>
        </div>
        <div className="col-span-2 p-15 pr-0 flex justify-start items-center">
          <div className="text-15">
            <Typography className="font-semibold">{bond.displayName}</Typography>
            {bond.isLp && (
              <div>
                <a href={bond.lpUrl} target="_blank">
                  <Typography variant="body1" className="font-semibold">
                    Add LP
                    <SvgIcon component={ArrowUpIcon} className="pl-5"/>
                  </Typography>
                </a>
              </div>
            )}
          </div>
        </div>
        <div className="p-15 flex justify-start items-center">
          <Typography className="bond-price font-semibold">
            <>{isBondLoading ? <Skeleton width="50px" className="h-20 w-50"/> :
              <>{!bond.isAvailable[chainID] ? (<>--</>) : (
                `${formatCurrency(bond.bondPrice, 4)}`)}
              </>
            }</>
          </Typography>
        </div>
        <div className="col-span-3 p-15 ml-20 flex justify-start items-center">
          <Typography variant="h6" className="font-semibold">
            {isBondLoading ? <Skeleton className="h-20 w-50"/> :
              <>{!bond.isAvailable[chainID] ?
                <>--</> : `${bond.bondDiscount && formatNumber(bond.bondDiscount * 100, 2)}%`}</>}
          </Typography>
        </div>
        <div className="col-span-2 p-15 flex justify-end items-center">
          <Typography variant="h6" className="font-semibold">
            {isBondLoading ? (
              <Skeleton width="80px"/>
            ) : (
              new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
              }).format(bond.purchased)
            )}
          </Typography>
        </div>
        <div className="col-span-2 p-15">
          <Link to={`/bonds/${bond.name}`}>
            <button
              className={`rounded-lg ${!bond.isAvailable[chainID] ? 'border-white-600 text-white-600 w-110' : 'border-goldsand'}  border-2 text-center py-2 px-20`}>
              <Typography variant="h6" className="font-semibold">
                {!bond.isAvailable[chainID] ? 'Sold Out' : `Bond`}
              </Typography>
            </button>
          </Link>
        </div>
      </div>)
  } else {
    return (
      <div className="msm:block md:hidden rounded-lg border-goldsand border-3 w-full px-30 py-20 mb-30 text-white"
           key={key}>
        <div className="col-span-3 flex items-center">
          <BondLogo bond={bond}/>
          <div className="text-15 align-middle">
            <Typography className="font-semibold">{bond.displayName}</Typography>
            {bond.isLp && (
              <div>
                <a href={bond.lpUrl} target="_blank">
                  <Typography variant="body1">
                    View Contract
                    <SvgIcon component={ArrowUpIcon} className="pl-5"/>
                  </Typography>
                </a>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center my-10">
          <Typography className="font-semibold">Price</Typography>
          <Typography className="font-semibold">
            <>{isBondLoading ? <Skeleton width="50px"/> :
              <>{!bond.isAvailable[chainID] ? (<>--</>) : (
                `${formatCurrency(bond.bondPrice, 4)}`)}
              </>
            }</>
          </Typography>
        </div>
        <div className="flex justify-between items-center my-10">
          <Typography className="font-semibold">ROI</Typography>
          <Typography className="font-semibold">
            {isBondLoading ? <Skeleton
              width="50px"/> : <>{!bond.isAvailable[chainID] ? <>--</> : `${bond.bondDiscount && formatNumber(bond.bondDiscount * 100, 2)}%`}</>}

          </Typography>
        </div>
        <div className="flex justify-between items-center my-10">
          <Typography className="font-semibold">Purchased</Typography>
          <Typography variant="h6" className="font-semibold">
            {isBondLoading ? (
              <Skeleton width="80px"/>
            ) : (
              new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
              }).format(bond.purchased)
            )}
          </Typography>
        </div>
        <Link to={`/bonds/${bond.name}`}>
          <button
            className={`rounded-lg ${!bond.isAvailable[chainID] ? 'border-white-600 text-white-600' : 'border-goldsand'} w-full border-2 text-center py-5 px-20`}>
            <Typography variant="h5"
                        className="font-semibold">{!bond.isAvailable[chainID] ? 'Sold Out' : `Bond ${bond.displayName}`}</Typography>
          </button>
        </Link>
      </div>)
  }

}

export default BondItem;
