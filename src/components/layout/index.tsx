import React, { FunctionComponent } from 'react';
import { Layout } from 'antd';
const { Content } = Layout;
import { Header, MapCard, SideBar } from 'components';
import './style';
import { GlobalContextProvider } from 'components';

export const EasyLayout: FunctionComponent = props => {
  return (
    <GlobalContextProvider>
      <Layout className="layout">
        <Layout.Header className="header">
          <Header />
        </Layout.Header>
        <Content className="content">
          <Layout className="contentLayout">
            <Content className="mainColumn">
              <MapCard>
                {props.children}
              </MapCard>
            </Content>
            <SideBar />
          </Layout>
        </Content>
      </Layout>
    </GlobalContextProvider>
  );
};
