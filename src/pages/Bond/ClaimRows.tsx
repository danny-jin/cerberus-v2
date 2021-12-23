import { Skeleton } from "@material-ui/lab";
import { Box, Button, Typography, TableRow, TableCell} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";

import BondLogo from './BondLogo';
import { RootState } from '../../core/store/store';
import { isPendingTxn, txnButtonTextGeneralPending } from '../../core/store/slices/pendingTxSlice';
import { redeemBond } from '../../core/store/slices/bondSlice';
import { useWeb3Context } from '../../core/hooks/web3Context';
import { useBonds } from '../../core/hooks/useBonds';
import { formatNumber, prettyVestingPeriod } from '../../core/utils/base';

export function ClaimBondTableData({ userBond }) {
  const dispatch = useDispatch();
  const { address, chainID, provider } = useWeb3Context();
  const { bonds } = useBonds(chainID);

  const bond = userBond[1];
  const bondName = bond.bond;

  const isAppLoading = useSelector((state: RootState) => state.app.loading ?? true);

  const currentBlock = useSelector((state: RootState) => {
    return state.app.currentBlock;
  });

  const pendingTransactions = useSelector((state: RootState) => {
    return state.pendingTx;
  });

  const vestingPeriod = () => {
    return prettyVestingPeriod(currentBlock, bond.bondMaturationBlock);
  };

  async function onRedeem({ autostake }) {
    let currentBond = bonds.find(bnd => bnd.name === bondName);
    await dispatch(redeemBond({ address, bond: currentBond, networkID: chainID, provider, autostake }));
  }

  return (
    <TableRow id={`${bondName}--claim`}>
      <TableCell className="text-left">
        <BondLogo bond={bond} />
        <div className="w-3/5 ml-5 flex flex-col justify-center items-start text-left">
          <Typography variant="body1" className="leading-5">
            {bond.displayName ? formatNumber(bond.displayName, 3) : <Skeleton className="w-100 ml-5 text-20" />}
          </Typography>
        </div>
      </TableCell>
      <TableCell align="center">
        {bond.pendingPayout ? formatNumber(bond.pendingPayout, 3) : <Skeleton width={100} />}
      </TableCell>
      <TableCell align="center">{bond.interestDue ? formatNumber(bond.interestDue, 4) : <Skeleton width={100} />}</TableCell>
      <TableCell align="right" style={{ whiteSpace: "nowrap" }}>
        {isAppLoading ? <Skeleton /> : vestingPeriod()}
      </TableCell>
      <TableCell align="right">
        <Button
          variant="outlined"
          color="primary"
          disabled={isPendingTxn(pendingTransactions, "redeem_bond_" + bondName)}
          onClick={() => onRedeem({ autostake: false })}
        >
          <Typography variant="h6">
            {txnButtonTextGeneralPending(pendingTransactions, "redeem_bond_" + bondName, "Claim")}
          </Typography>
        </Button>
      </TableCell>
    </TableRow>
  );
}

export function ClaimBondCardData({ userBond, className }) {
  const dispatch = useDispatch();
  const { address, chainID, provider } = useWeb3Context();
  const { bonds } = useBonds(chainID);

  const bond = userBond[1];
  const bondName = bond.bond;

  const currentBlock = useSelector((state: RootState) => {
    return state.app.currentBlock;
  });

  const pendingTransactions = useSelector((state: RootState) => {
    return state.pendingTx;
  });

  const vestingPeriod = () => {
    return prettyVestingPeriod(currentBlock, bond.bondMaturationBlock);
  };

  async function onRedeem({ autostake }) {
    let currentBond = bonds.find(bnd => bnd.name === bondName);
    await dispatch(redeemBond({ address, bond: currentBond, networkID: chainID, provider, autostake }));
  }

  return (
    <div id={`${bondName}`} className={`m-auto mb-30 ${className}`}>
      <div className="flex justify-center items-center mb-15">
        <BondLogo bond={bond} />
        <div>
          <Typography>{bond.displayName ? formatNumber(bond.displayName, 4) : <Skeleton width={100} className="ml-5 align-middle text-15" />}</Typography>
        </div>
      </div>

      <div className="mb-15">
        <Typography>Claimable</Typography>
        <Typography>{bond.pendingPayout ? formatNumber(bond.pendingPayout, 3) : <Skeleton width={100} />}</Typography>
      </div>

      <div className="mb-15">
        <Typography>Pending</Typography>
        <Typography>{bond.interestDue ? formatNumber(bond.interestDue, 3) : <Skeleton width={100} />}</Typography>
      </div>

      <div className="mb-15" style={{ marginBottom: "20px" }}>
        <Typography>Fully Vested</Typography>
        <Typography>{vestingPeriod()}</Typography>
      </div>
      <Box className="flex flex-col justify-around items-center">
        <Button
          variant="outlined"
          color="primary"
          className="w-full"
          disabled={isPendingTxn(pendingTransactions, "redeem_bond_" + bondName)}
          onClick={() => onRedeem({ autostake: false })}
        >
          <Typography variant="h5">
            {txnButtonTextGeneralPending(pendingTransactions, "redeem_bond_" + bondName, "Claim")}
          </Typography>
        </Button>
        <Button variant="outlined" color="primary" className="w-full" onClick={() => onRedeem({ autostake: true })}>
          <Typography variant="h5">
            {txnButtonTextGeneralPending(
              pendingTransactions,
              "redeem_bond_" + bondName + "_autostake",
              "Claim and Stake",
            )}
          </Typography>
        </Button>
      </Box>
    </div>
  );
}
