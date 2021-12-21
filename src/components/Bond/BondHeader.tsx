import { Typography, Link } from '@material-ui/core';
import { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';

import BondLogo from './BondLogo';
import AdvancedSettings from './AdvancedSettings';
import { CloseIcon, SettingIcon } from '../CustomSvg';
import { useEscape } from '../../core/hooks/base';

function BondHeader({bond, slippage, recipientAddress, onRecipientAddressChange, onSlippageChange}) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let history = useHistory();

  useEscape(() => {
    if (open) handleClose();
    else history.push('/bonds');
  });

  return (
    <div className="flex justify-between items-center">
      <Link component={NavLink} to="/bonds">
        <CloseIcon fill="white"/>
      </Link>

      <div className="flex justify-center items-center text-center">
        <BondLogo bond={bond}/>
        <div className="text-center ml-5">
          <Typography variant="h5">{bond.displayName}</Typography>
        </div>
      </div>

      <div>
        <div onClick={handleOpen}>
          <SettingIcon fill="white"/>
        </div>
        <AdvancedSettings
          open={open}
          handleClose={handleClose}
          slippage={slippage}
          recipientAddress={recipientAddress}
          onRecipientAddressChange={onRecipientAddressChange}
          onSlippageChange={onSlippageChange}
        />
      </div>
    </div>
  );
}

export default BondHeader;
