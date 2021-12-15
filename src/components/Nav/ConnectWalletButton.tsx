import React, { useEffect, useState } from 'react';

import { useWeb3Context } from '../../hooks/web3Context';

const ConnectWalletButton = () => {

  const {connect, disconnect, connected} = useWeb3Context();
  const [isConnected, setIsConnected] = useState(connected);

  const connectWallet = () => {
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
    <button className="rounded-md bg-gradient-to-r to-paarl from-corvette w-155 h-40 text-white font-semibold m-5"
            onClick={() => connectWallet()}>
      {isConnected ? 'Disconnect' : 'Connect Wallet'}
    </button>
  );
}

export default ConnectWalletButton
