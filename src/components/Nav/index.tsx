import React from 'react'
import { useDispatch } from 'react-redux';

import ConnectWalletButton from './ConnectWalletButton';
import { CollapseIcon } from '../CustomSvg';
import { toggleSidebar } from '../../core/store/slices/appSlice';

const Nav = () => {
  const dispatch = useDispatch();

  const openSidebar = () => {
    dispatch(toggleSidebar())
  }

  return (
    <div className="flex flex-row justify-between items-center w-full bg-black h-55 md:h-85 md:p-10">
      <div onClick={openSidebar}
        className="flex justify-center items-center cursor-pointer bg-gradient-to-b to-paarl from-corvette w-45 h-40 rounded m-5">
        <CollapseIcon width="20px" fill="black"/>
      </div>
      <ConnectWalletButton/>
    </div>
  )
}

export default Nav;
