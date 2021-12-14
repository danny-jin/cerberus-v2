import React from 'react';

import Navbar from '../components/Nav'
import Sidebar from '../components/Sidebar';
import * as SideBarItems from '../core/data/Sidebar';

const Layout = ({ children }) => {

  return (
    <div className="flex flex-col w-full h-screen">
      <div className="w-full fixed top-0 left-0 z-10">
        <Navbar/>
      </div>
      <div className="flex flex-grow">
        <div className="hidden md:block z-20">
          <Sidebar items={ SideBarItems }/>
        </div>
        <div className="flex-grow w-full h-full bg-black pt-55 md:pt-85 px-10 pb-10">{ children }</div>
      </div>
    </div>

  )
}

export default Layout;
