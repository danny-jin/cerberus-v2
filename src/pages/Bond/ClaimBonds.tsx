import {
  Button,
  Typography,
  Paper,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Table,
  Zoom,
} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

import { ClaimBondTableData, ClaimBondCardData } from './ClaimRows';
import { useWeb3Context } from '../../core/hooks/web3Context';
import { useBonds } from '../../core/hooks/useBonds';
import { RootState } from '../../core/store/store';
import { isPendingTxn, txnButtonTextGeneralPending } from '../../core/store/slices/pendingTxSlice';
import { redeemAllBonds } from '../../core/store/slices/bondSlice';

function ClaimBonds({activeBonds}) {
  const dispatch = useDispatch();
  const {provider, address, chainID} = useWeb3Context();
  const {bonds} = useBonds(chainID);

  const [numberOfBonds, setNumberOfBonds] = useState(0);

  const pendingTransactions = useSelector((state: RootState) => {
    return state.pendingTx;
  });

  const pendingClaim = () => {
    return isPendingTxn(pendingTransactions, 'redeem_all_bonds') ||
      isPendingTxn(pendingTransactions, 'redeem_all_bonds_autostake');
  };

  const onRedeemAll = async ({autostake}) => {
    console.log('redeeming all bonds');

    await dispatch(redeemAllBonds({address, bonds, networkID: chainID, provider, autostake}));

    console.log('redeem all complete');
  };

  useEffect(() => {
    let bondCount = Object.keys(activeBonds).length;
    setNumberOfBonds(bondCount);
  }, [activeBonds]);

  return (
    <>
      {numberOfBonds > 0 && (
        <Zoom in={true}>
          <Paper className="rounded-lg border-goldsand border-3 bg-transparent w-full md:w-835 px-30 py-20 md:mb-0 mb-30">
            <div className="w-full min-h-35 mb-10">
              <Typography variant="h5" className="font-semibold">Your Bonds (1,1)</Typography>
            </div>
            <div>
              <TableContainer className="md:block hidden">
                <Table aria-label="Claimable bonds">
                  <TableHead>
                    <TableRow>
                      <TableCell className="text-center">Bond</TableCell>
                      <TableCell className="text-center">Claimable</TableCell>
                      <TableCell className="text-center">Pending</TableCell>
                      <TableCell className="text-right">Fully Vested</TableCell>
                      <TableCell className="text-right"/>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(activeBonds).map((bond, i) => (
                      <ClaimBondTableData key={i} userBond={bond}/>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {Object.entries(activeBonds).map((bond, i) =>
                <ClaimBondCardData key={i} userBond={bond} className="md:hidden block"/>)}
              <div
                className={`flex w-full my-15 md:flex-row flex-col justify-center items-center md:flex-nowrap md: items-start`}
              >
                {numberOfBonds > 1 && (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      className="w-full max-w-235 min-w-185 max-w-410 m-5"
                      disabled={pendingClaim()}
                      onClick={() => {
                        onRedeemAll({autostake: false}).then();
                      }}
                    >
                      {txnButtonTextGeneralPending(pendingTransactions, 'redeem_all_bonds', 'Claim all')}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Paper>
        </Zoom>
      )}
    </>
  );
}

export default ClaimBonds;
