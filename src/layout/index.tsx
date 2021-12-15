import React from 'react';

import Navbar from '../components/Nav'
import Sidebar from '../components/Sidebar';
import { menuItems, socialItems, externalItems } from '../core/data/sidebar';

const Layout = ({children}) => {

  return (
    <div className="flex flex-col w-full h-screen bg-gradient-to-b from-codgray1 to-codgray2">
      <div className="w-full fixed top-0 left-0 z-10">
        <Navbar/>
      </div>
      <div className="flex flex-grow">
        <div className="hidden md:block z-20">
          <Sidebar menuItems={menuItems} socialItems={socialItems} externalItems={externalItems}/>
        </div>
        <div
          className="flex-grow w-full h-full bg-background-cerberus-flat bg-no-repeat bg-85% bg-center pt-55 md:pt-85 px-10 pb-10 overflow-y-auto scrollbar-hide">{children}</div>
      </div>
    </div>

  )
}

export default Layout;
