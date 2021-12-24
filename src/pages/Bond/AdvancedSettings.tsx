import { Typography, Modal, FormControl, OutlinedInput, InputLabel, InputAdornment, Backdrop } from '@material-ui/core';
import React from 'react';

import { CloseIcon } from '../../components/CustomSvg';

function AdvancedSettings({
  open,
  handleClose,
  slippage,
  recipientAddress,
  onRecipientAddressChange,
  onSlippageChange,
}) {
  return (
    <Modal id="hades" open={open} onClose={handleClose}
           className="absolute flex justify-center items-center z-40 backdrop-blur-lg">
      <Backdrop open={true}>
      <div className=" flex flex-col border-3 border-goldsand rounded-2xl w-400 md:w-500 self-center justify-self-center w-9/12 px-30 pt-20 pb-30 bg-black backdrop-blur-lg text-white">
        <div className="flex w-full">
          <div onClick={handleClose} className="p-15">
            <CloseIcon fill="white" />
          </div>
          <Typography variant="h3" className="self-center justify-self-center text-center w-9/12">Danny Jin</Typography>
        </div>

        <div className="flex flex-col justify-evenly">
          <InputLabel htmlFor="slippage" className="mt-35 mb-10">Slippage</InputLabel>
          <FormControl variant="outlined" color="primary" className="w-full">
            <OutlinedInput
              id="slippage"
              value={slippage}
              onChange={onSlippageChange}
              className="border-white border"
              type="number"
              endAdornment={<InputAdornment position="end">%</InputAdornment>}
            />
            <div className="m-10">
              <Typography variant="body2" color="textSecondary">
                Transaction may revert if price changes by more than slippage %
              </Typography>
            </div>
          </FormControl>

          <InputLabel htmlFor="recipient" className="mt-35 mb-10">Recipient Address</InputLabel>
          <FormControl variant="outlined" color="primary" className="w-full">
            <OutlinedInput id="recipient" value={recipientAddress} onChange={onRecipientAddressChange} type="text" className="border-white border"/>
            <div className="m-10">
              <Typography variant="body2" color="textSecondary">
                Choose recipient address. By default, this is your currently connected address
              </Typography>
            </div>
          </FormControl>
        </div>
      </div>
      </Backdrop>
    </Modal>
  );
}

export default AdvancedSettings;
