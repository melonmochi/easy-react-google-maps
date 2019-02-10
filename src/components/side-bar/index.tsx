import React, { FunctionComponent,
  useState } from 'react';
import { Layout, Menu, Icon } from 'antd';
const { Sider } = Layout
import './style';
import { MapTool } from 'components';

const SubMenu = Menu.SubMenu;

export const EasySideBar: FunctionComponent = () => {

  const [ collapse, onCollapse ] = useState(false)

  return (
    <Sider
      theme='light'
      className="sideBar"
      collapsible
      collapsed={collapse}
      onCollapse={(c: boolean) => onCollapse(c)}
      reverseArrow
      width={300}
    >
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
    </Sider>
  );
};
