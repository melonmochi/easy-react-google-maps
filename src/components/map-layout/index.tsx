import * as React from 'react';
import { Layout , Card } from 'antd';

const { Header, Content, Footer, Sider } = Layout;

export default class MapLayout extends React.Component {
  state = {
    collapsed: false,
  };

  onCollapse = (collapsed: boolean) => {
    this.setState({ collapsed });
  }

  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            {this.props.children}
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Easy React Google Maps ©2018 Created by Easy React Google Maps Team
            </Footer>
        </Layout>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div className="logo" />
          <Card >
            <p>Card content</p>
          </Card>
        </Sider>
      </Layout>
    );
  }
}
