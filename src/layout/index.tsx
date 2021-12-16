import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Navbar from '../components/Nav'
import Sidebar from '../components/Sidebar';
import { RootState } from '../core/store/store';
import { toggleSidebar } from '../core/store/slices/appSlice';
import { menuItems, socialItems, externalItems } from '../core/data/sidebar';

const Layout = ({children}) => {
  const dispatch = useDispatch();

  const isCollapsed = useSelector((state: RootState) => state.app.isCollapsed);

  const closeSidebar = () => {
    if (!isCollapsed) {
      dispatch(toggleSidebar())
    }
  }

  return (
    <div className="flex flex-col w-full h-screen bg-gradient-to-b from-codgray1 to-codgray2" onClick={closeSidebar}>
      <div className="w-full fixed z-10">
        <Navbar/>
      </div>
      <div className="flex flex-grow overflow-hidden">
        <div className={`md:block fixed md:static z-20 transition-all ${isCollapsed ? '-left-280': 'left-0'}`}>
          <Sidebar menuItems={menuItems} socialItems={socialItems} externalItems={externalItems}/>
        </div>
        <div className="flex-grow w-full h-full bg-background-cerberus-flat bg-no-repeat bg-85% bg-center
        pt-55 md:pt-85 px-10 pb-10 overflow-y-auto scrollbar-hide">{children}</div>
      </div>
    </div>

  )
}

export default Layout;
