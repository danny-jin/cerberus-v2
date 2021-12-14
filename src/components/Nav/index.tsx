import React from 'react'

import { CollapseIcon } from '../CustomSvg';

const Nav = () => {

  return (
    <div className="flex flex-row justify-between items-center w-full bg-transparent h-55 md:h-85 md:p-10">
      <div className="flex justify-center items-center cursor-pointer bg-gradient-to-b to-paarl from-corvette w-45 h-40 rounded m-5">
        <CollapseIcon width="20px" fill="black"/>
      </div>
      <button className="rounded-md bg-gradient-to-r to-paarl from-corvette w-155 h-40 text-white font-semibold m-5">Connect Wallet</button>
    </div>
  )
}

export default Nav;
