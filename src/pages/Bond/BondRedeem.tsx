import { Button, Typography, Slide } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { useSelector, useDispatch } from 'react-redux';
import React from 'react';
import { isNaN } from 'formik';

import ConnectWalletButton from '../../components/Nav/ConnectWalletButton';
import { RootState } from '../../core/store/store';
import { redeemBond } from '../../core/store/slices/bondSlice';
import { isPendingTxn, txnButtonText } from '../../core/store/slices/pendingTxSlice';
import { useWeb3Context } from '../../core/hooks/web3Context';
import { formatNumber, prettifySeconds, secondsUntilBlock, prettyVestingPeriod } from '../../core/utils/base';

function BondRedeem({bond}) {
  const dispatch = useDispatch();
  const {provider, address, chainID} = useWeb3Context();

  const isBondLoading = useSelector((state: RootState) => state.bonding.loading ?? true);
  const currentBlock = useSelector((state: RootState) => state.app.currentBlock);
  const pendingTransactions = useSelector((state: RootState) => state.pendingTx);
  const bondingState = useSelector((state: RootState) => state.bonding && state.bonding[bond.name]);

  const onRedeem = async ({autostake}) => {
    await dispatch(redeemBond({address, bond, networkID: chainID, provider, autostake}));
  };

  const vestingPeriod = () => {
    const vestingBlock = parseInt(currentBlock) + parseInt(bondingState.vestingTerm);
    const seconds = secondsUntilBlock(currentBlock, vestingBlock);
    return prettifySeconds(seconds, 'day');
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-around flex-wrap">
        {!address ? (
          <ConnectWalletButton className="text-20 font-semibold"/>
        ) : (
          <>
            <Button
              variant="contained"
              color="primary"
              id="bond-claim-btn"
              className="min-w-185 max-w-410 w-full m-5"
              disabled={isPendingTxn(pendingTransactions, 'redeem_bond_' + bond.name) || bond.pendingPayout == 0.0}
              onClick={() => {
                onRedeem({autostake: false}).then();
              }}
            >
              {txnButtonText(pendingTransactions, 'redeem_bond_' + bond.name, 'Claim')}
            </Button>
            <Button
              variant="contained"
              color="primary"
              id="bond-claim-autostake-btn"
              className="min-w-185 max-w-410 w-full m-5"
              disabled={
                isPendingTxn(pendingTransactions, 'redeem_bond_' + bond.name + '_autostake') ||
                bond.pendingPayout == 0.0
              }
              onClick={() => {
                onRedeem({autostake: true}).then();
              }}
            >
              {txnButtonText(pendingTransactions, 'redeem_bond_' + bond.name + '_autostake', 'Claim and Autostake')}
            </Button>
          </>
        )}
      </div>
      <Slide direction="right" in={true} mountOnEnter unmountOnExit {...{timeout: 533}}>
        <div className="mt-10">
          <div className="flex items-center justify-between h-25 mb-5">
            <Typography>Pending Rewards</Typography>
            <div>
              {isBondLoading || isNaN(bond.interestDue) || bond.interestDue === undefined ? (
                <Skeleton width="100px"/>
              ) : (
                <Typography variant="h5" color="primary" className="text-center">
                  {`${new Intl.NumberFormat('en-US').format(Number(formatNumber(bond.interestDue, 4)))} 3DOG`}
                </Typography>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between h-25 mb-5">
            <Typography>Claimable Rewards</Typography>
            <div>
              {isBondLoading || isNaN(bond.pendingPayout) || bond.pendingPayout === undefined ? (
                <Skeleton width="100px"/>
              ) : (
                <Typography variant="h5" color="primary" className="text-center">
                  {`${new Intl.NumberFormat('en-US').format(Number(formatNumber(bond.pendingPayout, 4)))} 3DOG`}
                </Typography>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between h-25 mb-5">
            <Typography>Time until fully vested</Typography>
            <div>
              {isBondLoading || isNaN(bond.bondMaturationBlock) || bond.bondMaturationBlock === undefined ? (
                <Skeleton width="100px"/>
              ) : (
                <Typography variant="h5" color="primary" className="text-center">
                  {prettyVestingPeriod(currentBlock, bond.bondMaturationBlock)}
                </Typography>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between h-25 mb-5">
            <Typography>ROI</Typography>
            <div>
              {isBondLoading || isNaN(bond.bondDiscount) || bond.bondDiscount === undefined ? (
                <Skeleton width="100px"/>
              ) : (
                <Typography variant="h5" color="primary" className="text-center">
                  {`${new Intl.NumberFormat('en-US').format(Number(formatNumber(bond.bondDiscount * 100, 2)))}%`}
                </Typography>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between h-25 mb-5">
            <Typography>Debt Ratio</Typography>
            <div>
              {isBondLoading || isNaN(bond.debtRatio) || bond.debtRatio === undefined ? (
                <Skeleton width="100px"/>
              ) : (
                <Typography variant="h5" color="primary" className="text-center">
                  {`${new Intl.NumberFormat('en-US').format(Number(formatNumber(bond.debtRatio / 10000000, 4)))}%`}
                </Typography>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between h-25 mb-5">
            <Typography>Vesting Term</Typography>
            <div>
              {isBondLoading || isNaN(bond.vestingTerm) || bond.vestingTerm === undefined ? (
                <Skeleton width="100px"/>
              ) : (
                <Typography variant="h5" color="primary" className="text-center">
                  {vestingPeriod()}
                </Typography>
              )}
            </div>
          </div>
        </div>
      </Slide>
    </div>
  );
}

export default BondRedeem;
