import { Skeleton } from '@material-ui/lab';
import { Backdrop, Fade, Grid, Tab, Tabs, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { isNaN } from 'formik';

import BondRedeem from './BondRedeem';
import BondPurchase from './BondPurchase';
import BondHeader from './BondHeader'
import TabPanel from '../../components/TabPanel';
import { formatCurrency } from '../../core/utils/base';
import { useWeb3Context } from '../../core/hooks/web3Context';
import { RootState } from '../../core/store/store';

const BondDetail = ({bond}) => {
  const {provider, address} = useWeb3Context();
  const [slippage, setSlippage] = useState(20);
  const [recipientAddress, setRecipientAddress] = useState(address);
  const [view, setView] = useState(0);
  const isBondLoading = useSelector((state: RootState) => state.bonding.loading ?? true);

  const onRecipientAddressChange = e => {
    return setRecipientAddress(e.target.value);
  };

  const onSlippageChange = e => {
    return setSlippage(e.target.value);
  };

  const changeView = (event, newView) => {
    setView(newView);
  };

  useEffect(() => {
    if (address) {
      setRecipientAddress(address);
    }
  }, [provider, address]);

  return (
    <Fade in={true} mountOnEnter unmountOnExit>
      <Grid className="z-30 absolute w-full">
        <Backdrop open={true}>
          <Fade in={true}>
            <div
              className="md:max-w-805 w-full min-h-605 border-3 border-goldsand rounded-2xl p-30 text-white  bg-black overflow-hidden">
              <BondHeader
                bond={bond}
                slippage={slippage}
                recipientAddress={recipientAddress}
                onSlippageChange={onSlippageChange}
                onRecipientAddressChange={onRecipientAddressChange}
              />
              <div className="flex justify-around items-center m-25">
                <div>
                  <Typography variant="h5" className="">
                    Bond Price
                  </Typography>
                  <Typography className="text-center text-25 font-extrabold">
                    {isBondLoading || isNaN(bond.bondPrice) || bond.bondPrice === undefined ? <Skeleton className="w-50"/> : formatCurrency(bond.bondPrice, 3)}
                  </Typography>
                </div>
                <div>
                  <Typography variant="h5">
                    Market Price
                  </Typography>
                  <Typography className="text-center text-25 font-extrabold">
                    {isBondLoading || isNaN(bond.marketPrice) || bond.marketPrice === undefined ? <Skeleton className="w-50"/> : formatCurrency(bond.marketPrice, 3)}
                  </Typography>
                </div>
              </div>

              <Tabs
                centered
                value={view}
                textColor="primary"
                indicatorColor="primary"
                onChange={changeView}
                aria-label="bond tabs"
                className="mb-20"
              >
                <Tab label="Bond" id="simple-tab-0"/>
                <Tab label="Redeem" id="simple-tab-1"/>
              </Tabs>

              <TabPanel value={view} index={0}>
                <BondPurchase bond={bond} slippage={slippage} recipientAddress={recipientAddress}/>
              </TabPanel>
              <TabPanel value={view} index={1}>
                <BondRedeem bond={bond}/>
              </TabPanel>
            </div>
          </Fade>
        </Backdrop>
      </Grid>
    </Fade>
  );
}

export default BondDetail;
