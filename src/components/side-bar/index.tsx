import React, { FunctionComponent, useState } from 'react';
import { Layout, Menu, Icon, Card } from 'antd';
const { Sider } = Layout;
import './style';
import { MapTool, StopsList } from 'components';

const SubMenu = Menu.SubMenu;
const MapMenu = () => <Menu
  theme="light"
  defaultOpenKeys={['files', 'calendars', 'network', 'basictools']}
  mode="inline"
  className="sideBarMenu"
>
  <SubMenu
    key="basictools"
    title={
      <span>
        <Icon type="tool" />
        <span>Basic tools</span>
      </span>
    }
  >
    <MapTool />
  </SubMenu>
  <Menu.Item key="drawer" disabled>
    <Icon type="edit" />
    <span>Drawer</span>
  </Menu.Item>
</Menu>

const MenuOptionsList = [
  {
    key: 'map-menu',
    tab: 'Map',
  },
  {
    key: 'marker-menu',
    tab: 'Marker',
  },
];

const MenuList = {
  'map-menu': <MapMenu />,
  'marker-menu': <StopsList />,
}

export const EasySideBar: FunctionComponent = () => {
  const [collapse, onCollapse] = useState(false);
  const [menuOption, setMenuOption] = useState<'map-menu' | 'marker-menu'>('map-menu')

  const onTabChange = (key: 'map-menu' | 'marker-menu') => setMenuOption(key)

  return (
    <Sider
      theme="light"
      className="sideBar"
      collapsible
      collapsed={collapse}
      onCollapse={(c: boolean) => onCollapse(c)}
      reverseArrow
      width={300}
    >
      <Card
        className="menu-card"
        tabList={MenuOptionsList}
        activeTabKey={menuOption}
        onTabChange={onTabChange}
        bordered={false}
        bodyStyle={{padding:0, marginTop: '1px', height: '100%'}}
      >
        {MenuList[menuOption]}
      </Card>
    </Sider>
  );
};
