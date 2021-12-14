import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom';

import * as IconModule from '../../components/CustomSvg'
import { LogoIcon, MediumIcon, TwitterIcon, DiscordIcon } from '../../components/CustomSvg';

import { SvgProps } from '../../core/interfaces/Svg';
import { SidebarItem, SidebarProps } from '../../core/interfaces/Sidebar';

const Sidebar = (props: SidebarProps) => {
  console.log(props.items.externalItems)
  let history = useHistory();

  const handleSubItem = (index: number) => {
    //TODO: handle event when child-menuItem click
  }

  const navigation = (item: SidebarItem) => {
    return history.push(`${ item.url }`)
  }

  const IconSVG = (IconModule as unknown) as { [key: string]: React.FC<SvgProps> };

  return (<>
    <div className="flex flex-col items-between w-280 h-screen bg-gradient-to-b from-corvette to-rope">
      <div className="header flex flex-grow flex-col">
        <div className="logo m-35 flex justify-center">
          <LogoIcon width="200px" height="200px"></LogoIcon>
        </div>
        <div className="items ml-30">
          {
            props.items.menuItems.map((item: SidebarItem, index) => {
              const Icon = IconSVG[`${ item.icon }`];

              return (
                <div className="flex items-center my-10 cursor-pointer grab hover:text-alto" key={ index }
                     onClick={ () => {
                       navigation(item)
                     } }>
                  <Icon width="20px" fill="white" className="mr-10"/>
                  <span className="text-white text-17 font-semibold">{ item.name }</span>
                </div>
              )
            })
          }
        </div>
        <div className="externalItems ml-30 ">
          {
            props.items.externalItems.map((item: SidebarItem, index) => {
              const Icon = IconSVG[`${ item.icon }`];

              return (
                <div className="flex items-center my-10 cursor-pointer grab hover:text-alto" key={ index }
                     onClick={ () => {
                       navigation(item)
                     } }>
                  <Icon width="20px" fill="white" className="mr-10"/>
                  <span className="text-white text-17 font-semibold">{ item.name }</span>
                </div>
              )
            })
          }
        </div>
      </div>
      <div className="footer p-20 flex justify-around items-center">
        {
          props.items.socialItems.map((item: SidebarItem, index) => {
            const Icon = IconSVG[`${ item.icon }`];

            return (
              <Link className="flex items-center my-10 cursor-pointer grab hover:text-alto" key={ index }
                   href={item.url} target="_blank">
                <Icon width="20px" fill="white" className="mr-10"/>
              </Link>
            )
          })
        }
      </div>
    </div>
  </>)
}

export default Sidebar;
