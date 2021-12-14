export interface SidebarItem {
  name: string;
  icon?: string;
  url: string;
  children?: SidebarItem[]
}

export interface SidebarProps {
  menuItems: SidebarItem[];
  externalItems: SidebarItem[];
  socialItems: SidebarItem[];
}
