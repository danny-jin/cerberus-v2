import { Link, Typography } from '@material-ui/core';
import React from 'react'
import { useHistory, NavLink } from 'react-router-dom';
import * as IconModule from '../../components/CustomSvg'

import { LogoIcon } from '../../components/CustomSvg';
import { useWeb3Context } from '../../hooks/web3Context';
import { SvgProps } from '../../core/interfaces/svg';
import { SidebarItem, SidebarProps } from '../../core/interfaces/sidebar';
import { shorten } from 'core/utils/base';
import { LANDING_URL } from '../../core/data/base';

const Sidebar = (props: SidebarProps) => {
  const { provider, address, chainID } = useWeb3Context();
  let history = useHistory();

  const navigation = (item: SidebarItem) => {
    return history.push(`${item.url}`)
  }
  const IconSVG = (IconModule as unknown) as { [key: string]: React.FC<SvgProps> };

  const checkUrl = (match, location, page) => {
    return location.pathname.indexOf(page) >= 0;
  };

  return (<>
    <div className="flex flex-col items-between w-280 h-screen bg-gradient-to-b from-corvette to-rope">
      <div className="header flex flex-grow flex-col">
        <div className="logo mt-30 flex justify-center">
          <Link href={LANDING_URL} target="_blank">
            <LogoIcon width="200px" height="200px"/>
          </Link>
        </div>
        {
          address && (
            <div className="flex justify-center">
              <Link href={`https://etherscan.io/address/${address}`} className="text-12 mt-5 mb-15" target="_blank">
                {shorten(address)}
              </Link>
            </div>
          )
        }
        <div className="menuItems ml-30 mb-30">
          {
            props.menuItems.map((item: SidebarItem, index) => {
              const Icon = IconSVG[`${item.icon}`];

              return (
                <Link component={NavLink} to={item.url} className="flex items-center my-10 cursor-pointer grab hover:text-alto my-15" key={index}
                      isActive={(match, location) => {
                        return checkUrl(match, location, item.url);
                      }}>
                  <Icon width="20px" fill="white" className="mr-10"/>
                  <Typography variant="h6">{item.name}</Typography>
                </Link>
              )
            })
          }
        </div>
        <div className="externalItems ml-30 ">
          {
            props.externalItems.map((item: SidebarItem, index) => {
              const Icon = IconSVG[`${item.icon}`];

              return (
                <Link href={item.url} className="flex items-center my-15 cursor-pointer grab hover:text-alto" key={index} target="_blank">
                  <Icon width="20px" fill="white" className="mr-10"/>
                  <Typography variant="h6">{item.name}</Typography>
                </Link>
              )
            })
          }
        </div>
      </div>
      <div className="footer p-20 flex justify-around items-center">
        {
          props.socialItems.map((item: SidebarItem, index) => {
            const Icon = IconSVG[`${item.icon}`];

            return (
              <a href={item.url}
                 className="flex items-center my-10 cursor-pointer grab hover:text-alto"
                 key={index} target="_blank">
                <Icon width="20px" fill="white" className="mr-10"/>
              </a>
            )
          })
        }
      </div>
    </div>
  </>)
}

export default Sidebar;
