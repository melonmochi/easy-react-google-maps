import './style';
import React, { FunctionComponent, useState } from 'react';
import { Layout, Menu, Icon, Card, Tabs, Tooltip } from 'antd';
import { MapTool, StopsList } from 'components';
const { Sider } = Layout;
const { TabPane } = Tabs;
const SubMenu = Menu.SubMenu;

type MenuKeyType = 'map-menu' | 'marker-menu'
type MenuOptionsListType = Array<{ key: MenuKeyType, tabName: string, icon: string }>
const MenuOptionsList: MenuOptionsListType =
  [
    {
      key: 'map-menu',
      tabName: 'Map',
      icon: 'global',
    },
    {
      key: 'marker-menu',
      tabName: 'Marker',
      icon: 'flag',
    },
  ];

const MapMenu = () => (
  <Menu
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
)

const MenuList = {
  'map-menu': <MapMenu />,
  'marker-menu': <StopsList />,
}

const MenuCard = (key: MenuKeyType) => (
  <Card
    className="menu-card"
    bordered={false}
    headStyle={{ display: 'table' }}
    bodyStyle={{ height: '100%', padding: 0, marginTop: '1px' }}
  >
    {MenuList[key]}
  </Card>
)

const TabContent = (key: MenuKeyType, collapsed: boolean) => {
  const menuOption = MenuOptionsList.find( t => t.key === key)
  const opt = menuOption? { icon: menuOption.icon, tabName: menuOption.tabName }: {icon: '', tabName: ''}
  return (
    <TabPane tab={<span><Tooltip title={opt.tabName}><Icon type={opt.icon} />{collapsed? '': opt.tabName}</Tooltip></span>} key={key} >
      {MenuCard(key)}
    </TabPane>
  )
}

export const EasySideBar: FunctionComponent = () => {
  const [collapse, onCollapse] = useState(false);
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
      <Tabs className='menu-tabs' defaultActiveKey='map-menu'>
        {TabContent('map-menu', collapse)}
        {TabContent('marker-menu', collapse)}
      </Tabs>
    </Sider>
  );
};
