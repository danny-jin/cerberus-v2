import { Skeleton } from '@material-ui/lab';
import { Typography } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../core/store/store';
import { loadAppDetails } from '../../core/store/slices/appSlice';
import { useWeb3Context } from '../../hooks/web3Context';
import { secondsUntilBlock } from '../../core/utils/network';
import { prettifySeconds } from '../../core/utils/base';

const RebaseTimer = () => {
  const dispatch = useDispatch();
  const {provider, chainID} = useWeb3Context();

  const SECONDS_TO_REFRESH = 60;
  const [secondsToRebase, setSecondsToRebase] = useState(0);
  const [rebaseString, setRebaseString] = useState('');
  const [secondsToRefresh, setSecondsToRefresh] = useState(SECONDS_TO_REFRESH);

  const currentBlock = useSelector((state: RootState) => state.app.currentBlock);
  const nextRebase = useSelector((state: RootState) => state.app.nextRebase);

  const initializeTimer = () => {
    const seconds = secondsUntilBlock(currentBlock, nextRebase);
    setSecondsToRebase(seconds);
    const prettified = prettifySeconds(seconds);
    setRebaseString(prettified !== '' ? prettified : 'Less than a minute');
  }

  const reload = async () => {
    await dispatch(loadAppDetails({networkID: chainID, provider: provider}));
  }

  useEffect(() => {
    if (currentBlock) {
      initializeTimer();
    }
  }, [currentBlock]);

  // After every period SECONDS_TO_REFRESH, decrement secondsToRebase by SECONDS_TO_REFRESH,
  // Keeping the display up to date without requiring an on chain request to update currentBlock.
  useEffect(() => {
    let interval = null;
    if (secondsToRefresh > 0) {
      interval = setInterval(() => {
        setSecondsToRefresh(secondsToRefresh => secondsToRefresh - 1);
      }, 1000);
    } else {
      // When the countdown goes negative, reload the app details and reinitialize the timer
      if (secondsToRebase < 0) {
        reload().then();
        setRebaseString('');
      } else {
        clearInterval(interval);
        setSecondsToRebase(secondsToRebase => secondsToRebase - SECONDS_TO_REFRESH);
        setSecondsToRefresh(SECONDS_TO_REFRESH);

        const prettified = prettifySeconds(secondsToRebase);
        setRebaseString(prettified !== '' ? prettified : 'Less than a minute');
      }
    }
    return () => clearInterval(interval);
  }, [secondsToRebase, secondsToRefresh]);

  return (
    <div className="flex">
      {
        currentBlock ? (
          secondsToRebase > 0 ? (
            <Typography variant="body2" color="primary"><strong>{rebaseString}</strong> to next rebase</Typography>) : (
            <strong>rebasing</strong>
          )
        ) : (
          <Skeleton className="w-155"></Skeleton>
        )
      }
    </div>
  )
}

export default RebaseTimer;
