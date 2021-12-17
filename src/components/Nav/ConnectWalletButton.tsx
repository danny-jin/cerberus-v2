import { Box, Button, SvgIcon, Typography, Popper, Paper, Divider, Link, Slide, Fade } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { CaretDownIcon, ArrowUpIcon } from '../CustomSvg';
import { useWeb3Context } from '../../hooks/web3Context';
import { NetworkID } from '../../core/interfaces/network';
import { RootState } from '../../core/store/store';

const ConnectWalletButton = () => {

  const {connect, disconnect, connected, chainID} = useWeb3Context();
  const isCollapsed = useSelector((state: RootState) => state.app.isCollapsed);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isConnected, setConnected] = useState(connected);
  const [isHovering, setIsHovering] = useState(false);

  const pendingTransactions = useSelector((state: RootState) => {
    return state.pendingTx;
  });

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  let buttonText = 'Connect Wallet';
  let clickFunction = connect;

  if (isConnected) {
    buttonText = 'Disconnect';
    clickFunction = disconnect;
  }

  if (pendingTransactions && pendingTransactions.length > 0) {
    buttonText = 'In progress';
    // @ts-ignore
    clickFunction = handleClick;
  }

  const connectWallet = () => {
    if (!isCollapsed) {
      return;
    }
    clickFunction();
  };

  const open = Boolean(anchorEl);

  const getEtherScanUrl = txHash => {
    return chainID === NetworkID.Testnet ? 'https://rinkeby.etherscan.io/tx/' + txHash : 'https://etherscan.io/tx/' + txHash;
  };

  useEffect(() => {
    if (pendingTransactions.length === 0) {
      setAnchorEl(null);
    }
  }, [pendingTransactions]);

  useEffect(() => {
    setConnected(connected);
  }, [connected]);

  return (
    <div
      onMouseEnter={e => (pendingTransactions && pendingTransactions.length > 0 ? handleClick(e) : null)}
      onMouseLeave={e => (pendingTransactions && pendingTransactions.length > 0 ? handleClick(e) : null)}
      className="wallet-menu"
      id="wallet-menu"
    >
      <Button
        className={`flex items-center`}
        variant="contained"
        color="secondary"
        size="large"
        style={pendingTransactions.length > 0 ? {color: '#49A1F2'} : {}}
        onClick={connectWallet}
        onMouseOver={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        key={1}
      >
        {buttonText}
        {pendingTransactions.length > 0 && (
          <Slide direction="left" in={isHovering} {...{timeout: 333}}>
            <SvgIcon className="absolute right-5" component={CaretDownIcon} htmlColor={'#49A1F2'}/>
          </Slide>
        )}
      </Button>

      <Popper open={open} anchorEl={anchorEl} placement="bottom-end" transition>
        {({TransitionProps}) => {
          return (
            <Fade {...TransitionProps} timeout={100}>
              <Paper className="ohm-menu" elevation={1}>
                {pendingTransactions.map((x, i) => (
                  <div key={i} className="w-full">
                    <Link key={x.txHash} href={getEtherScanUrl(x.txHash)} target="_blank" rel="noreferrer">
                      <Button size="large" variant="contained" color="primary" fullWidth>
                        <Typography align="left">
                          {x.text} <SvgIcon component={ArrowUpIcon}/>
                        </Typography>
                      </Button>
                    </Link>
                  </div>
                ))}
                <Box className="mb-15">
                  <Divider color="primary"/>
                  <Button
                    size="large"
                    variant="contained"
                    color="primary"
                    onClick={disconnect}
                    className="w-full mb-0"
                  >
                    <Typography>Disconnect</Typography>
                  </Button>
                </Box>
              </Paper>
            </Fade>
          );
        }}
      </Popper>
    </div>
  );
}

export default ConnectWalletButton
