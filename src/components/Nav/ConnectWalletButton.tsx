import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { useWeb3Context } from '../../hooks/web3Context';
import { RootState } from '../../core/store/store';

const ConnectWalletButton = () => {

  const {connect, disconnect, connected} = useWeb3Context();
  const [isConnected, setIsConnected] = useState(connected);
  const isCollapsed = useSelector((state: RootState) => state.app.isCollapsed);

  const connectWallet = () => {
    if (!isCollapsed) {
      return;
    }
    if (isConnected) {
      disconnect();
    } else {
      connect();
    }
  };

  useEffect(() => {
    setIsConnected(connected);
  }, [connected]);

  return (
    <button className="rounded-md bg-gradient-to-r from-paarl to-corvette w-155 h-40 text-white font-semibold m-5"
            onClick={() => connectWallet()}>
      {isConnected ? 'Disconnect' : 'Connect Wallet'}
    </button>
  );
}

export default ConnectWalletButton
