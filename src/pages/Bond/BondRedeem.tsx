import { Button, Typography, Slide } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect, useState } from 'react';

import ConnectWalletButton from '../../components/Nav/ConnectWalletButton';
import { RootState } from '../../core/store/store';
import { redeemBond } from '../../core/store/slices/bondSlice';
import { isPendingTxn, txnButtonText } from '../../core/store/slices/pendingTxSlice';
import { useWeb3Context } from '../../core/hooks/web3Context';
import { BaseInfo, BaseInfoKey } from '../../core/interfaces/base';
import { formatNumber, prettifySeconds, secondsUntilBlock, prettyVestingPeriod } from '../../core/utils/base';

const defaultNetworkBaseInfos: BaseInfo[] = [
  {
    name: 'Pending Rewards',
    value: null,
    key: BaseInfoKey.PendingRewardAmount
  },
  {
    name: 'Claimable Rewards',
    value: null,
    key: BaseInfoKey.ClaimRewardAmount
  },
  {
    name: 'Time until fully vested',
    value: null,
    key: BaseInfoKey.RestVestingTime,
  }, {
    name: 'ROI',
    value: null,
    key: BaseInfoKey.Roi
  },
  {
    name: 'Debt Ratio',
    value: null,
    key: BaseInfoKey.DebtRate
  },
  {
    name: 'Vesting Term',
    value: null,
    key: BaseInfoKey.VestingTerm,
  },

]

function BondRedeem({bond}) {
  const dispatch = useDispatch();
  const {provider, address, chainID} = useWeb3Context();
  const [networkBaseInfos, setNetworkBaseInfos] = useState(defaultNetworkBaseInfos);

  const currentBlock = useSelector((state: RootState) => {
    return state.app.currentBlock;
  });
  const pendingTransactions = useSelector((state: RootState) => {
    return state.pendingTx;
  });
  const bondingState = useSelector((state: RootState) => {
    return state.bonding && state.bonding[bond.name];
  });

  const onRedeem = async ({autostake}) => {
    await dispatch(redeemBond({address, bond, networkID: chainID, provider, autostake}));
  };

  const vestingPeriod = () => {
    const vestingBlock = parseInt(currentBlock) + parseInt(bondingState.vestingTerm);
    const seconds = secondsUntilBlock(currentBlock, vestingBlock);
    return prettifySeconds(seconds, 'day');
  };

  useEffect(() => {
    const infos = defaultNetworkBaseInfos;
    infos.forEach((info: BaseInfo) => {
      switch (info.key) {
        case BaseInfoKey.PendingRewardAmount:
          if (bond.interestDue) {
            info.value = `${new Intl.NumberFormat('en-US').format(Number(formatNumber(bond.interestDue, 4)))} 3DOG`;
          }
          break;
        case BaseInfoKey.ClaimRewardAmount:
          if (bond.pendingPayout) {
            info.value = `${new Intl.NumberFormat('en-US').format(Number(formatNumber(bond.pendingPayout, 4)))} 3DOG`;
          }
          break;
        case BaseInfoKey.RestVestingTime:
          if (bond.bondMaturationBlock) {
            info.value = prettyVestingPeriod(currentBlock, bond.bondMaturationBlock);
          }
          break;
        case BaseInfoKey.Roi:
          if (bond.bondDiscount) {
            info.value = `${new Intl.NumberFormat('en-US').format(Number(formatNumber(bond.bondDiscount * 100, 2)))}%`;
          }
          break;
        case BaseInfoKey.DebtRate:
          if (bond.debtRatio) {
            info.value = `${new Intl.NumberFormat('en-US').format(Number(formatNumber(bond.debtRatio / 10000000, 4)))}%`;
          }
          break;
        case BaseInfoKey.VestingTerm:
          if (bond.vestingTerm) {
            info.value = vestingPeriod();
          }
          break;
        default:
          break;
      }
    });
    setNetworkBaseInfos([...infos]);
  }, [bond]);

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
          {
            networkBaseInfos.map((info: BaseInfo, index) => {
              return (
                <div className="flex justify-between mt-5" key={index}>
                  <Typography>{info.name}</Typography>
                  <div>
                    {!info.value ? (
                      <Skeleton width="100px"/>
                    ) : (
                      <Typography variant="h5" color="primary" className="text-center">
                        {info.value}
                      </Typography>
                    )}
                  </div>
                </div>
              )
            })}
        </div>
      </Slide>
    </div>
  );
}

export default BondRedeem;
