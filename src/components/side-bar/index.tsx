import './style';
import React, { FunctionComponent, useState } from 'react';
import { Layout, Menu, Icon, Card, Tabs, Tooltip } from 'antd';
import { MapTool, StopsList, Uploader, CalendarsList, RoutesTree } from 'components';
import { MenuOptionsListType, MenuKeyType } from 'typings';
const { Sider } = Layout;
const { TabPane } = Tabs;
const SubMenu = Menu.SubMenu;

const MenuOptionsList: MenuOptionsListType = [
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
  {
    key: 'route-menu',
    tabName: 'Route',
    icon: 'swap',
  },
];

const MapMenu = () => (
  <Menu
    theme="light"
    defaultOpenKeys={['files', 'calendars', 'basictools']}
    mode="inline"
    className="sideBarMenu"
  >
    <SubMenu
      key="files"
      title={
        <span>
          <Icon type="file" />
          <span>Files</span>
        </span>
      }
    >
      <Uploader />
    </SubMenu>
    <SubMenu
      key="calendars"
      title={
        <span>
          <Icon type="calendar" />
          <span>Calendars</span>
        </span>
      }
      disabled={false}
    >
      <CalendarsList />
    </SubMenu>
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
);

const MenuList = {
  'map-menu': <MapMenu />,
  'marker-menu': <StopsList />,
  'route-menu': <RoutesTree />,
};

const MenuCard = (key: MenuKeyType) => (
  <Card
    className="menu-card"
    bordered={false}
    headStyle={{ display: 'table' }}
    bodyStyle={{ height: '100%', padding: 0 }}
  >
    {MenuList[key]}
  </Card>
);

const TabContent = (collapsed: boolean) =>
  MenuOptionsList.map(opt => (
    <TabPane
      tab={
        <span>
          <Tooltip title={opt.tabName}>
            <Icon type={opt.icon} />
            {collapsed ? (
              ''
            ) : (
              <div style={{ marginLeft: 12, display: 'inline-flex' }}>{opt.tabName}</div>
            )}
          </Tooltip>
        </span>
      }
      key={opt.key}
    >
      {MenuCard(opt.key)}
    </TabPane>
  ));

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
      <Tabs className="menu-tabs" defaultActiveKey="map-menu">
        {TabContent(collapse)}
      </Tabs>
    </Sider>
  );
};
