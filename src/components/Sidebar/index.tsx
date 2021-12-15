import React from 'react'
import { useHistory } from 'react-router-dom';

import * as IconModule from '../../components/CustomSvg'
import { LogoIcon } from '../../components/CustomSvg';

import { SvgProps } from '../../core/interfaces/svg';
import { SidebarItem, SidebarProps } from '../../core/interfaces/sidebar';

const Sidebar = (props: SidebarProps) => {
  let history = useHistory();

  const navigation = (item: SidebarItem) => {
    return history.push(`${item.url}`)
  }
  const IconSVG = (IconModule as unknown) as { [key: string]: React.FC<SvgProps> };

  return (<>
    <div className="flex flex-col items-between w-280 h-screen bg-gradient-to-b from-corvette to-rope">
      <div className="header flex flex-grow flex-col">
        <div className="logo m-35 flex justify-center">
          <LogoIcon width="200px" height="200px"/>
        </div>
        <div className="menuItems ml-30 mb-30">
          {
            props.menuItems.map((item: SidebarItem, index) => {
              const Icon = IconSVG[`${item.icon}`];

              return (
                <div className="flex items-center my-10 cursor-pointer grab hover:text-alto" key={index}
                     onClick={() => {
                       navigation(item)
                     }}>
                  <Icon width="20px" fill="white" className="mr-10"/>
                  <span className="text-white text-17 font-semibold">{item.name}</span>
                </div>
              )
            })
          }
        </div>
        <div className="externalItems ml-30 ">
          {
            props.externalItems.map((item: SidebarItem, index) => {
              const Icon = IconSVG[`${item.icon}`];

              return (
                <a href={item.url} className="flex items-center my-10 cursor-pointer grab hover:text-alto" key={index} target="_blank">
                  <Icon width="20px" fill="white" className="mr-10"/>
                  <span className="text-white text-17 font-semibold">{item.name}</span>
                </a>
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
