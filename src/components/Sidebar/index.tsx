import { Link, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React from 'react'
import { NavLink } from 'react-router-dom';

import * as IconModule from '../../components/CustomSvg'
import { LogoIcon } from '../../components/CustomSvg';
import { useWeb3Context } from '../../core/hooks/web3Context';
import { SvgProps } from '../../core/interfaces/svg';
import { SidebarItem, SidebarProps } from '../../core/interfaces/sidebar';
import { useBonds } from '../../core/hooks/useBonds';
import { formatNumber } from 'core/utils/base';
import { shorten } from 'core/utils/base';
import { LANDING_URL } from '../../core/data/base';

const Sidebar = (props: SidebarProps) => {
  const {address, chainID} = useWeb3Context();
  const {bonds} = useBonds(chainID);

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
        <div className="ml-30">
          {
            props.menuItems.map((item: SidebarItem, index) => {
              const Icon = IconSVG[`${item.icon}`];

              return (
                <Link component={NavLink} to={item.url} className="flex items-center my-10 cursor-pointer group my-15"
                      key={index}
                      isActive={(match, location) => {
                        return checkUrl(match, location, item.url);
                      }}>
                  <Icon width="20px" fill="white" className="mr-10 group-hover:fill-alto"/>
                  <Typography variant="h6" className="group-hover:text-alto">{item.name}</Typography>
                </Link>
              )
            })
          }
        </div>
        <div className="mb-40 ml-30">
          <div className="text-left text-white px-35 mt-10">
            <Typography variant="body2" className="pb-5">Bond discounts</Typography>
            {bonds.map((bond, index) => (
              <div className="py-5" key={index}>
                <Link component={NavLink} to={`/bonds/${bond.name}`} className="no-underline">
                  {!bond.bondDiscount ? (
                    <Skeleton variant="text" className="w-150"/>
                  ) : (
                    <div className="flex justify-between">
                      <Typography variant="body2">{bond.displayName}</Typography>
                      <Typography className="float-left ml-35" variant="body2">
                        {!bond.isAvailable[chainID]
                          ? 'Sold Out'
                          : `${bond.bondDiscount && formatNumber(bond.bondDiscount * 100, 2)}%`}
                      </Typography>
                    </div>
                  )}
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className="externalItems ml-30 ">
          {
            props.externalItems.map((item: SidebarItem, index) => {
              const Icon = IconSVG[`${item.icon}`];

              return (
                <Link href={item.url} className="flex items-center my-15 cursor-pointer group" key={index}
                      target="_blank">
                  <Icon width="20px" fill="white" className="mr-10 group-hover:fill-alto"/>
                  <Typography variant="h6" className="group-hover:text-alto">{item.name}</Typography>
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
                 className="flex items-center my-10 cursor-pointer group"
                 key={index} target="_blank">
                <Icon width="20px" fill="white" className="mr-10 group-hover:fill-alto group-hover:scale-110"/>
              </a>
            )
          })
        }
      </div>
    </div>
  </>)
}

export default Sidebar;
