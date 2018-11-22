import * as React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { MapTool } from 'components'
import './style';

export interface MapProps {
  google?: typeof google
  map?: typeof google.maps.Map
  center?: google.maps.LatLng
}

export interface MapState {
  google?: typeof google
  map?: typeof google.maps.Map
  center?: { lat: number; lng: number; noWrap?: boolean }
  collapsed?: boolean
}

const { Content, Sider } = Layout;
const SubMenu = Menu.SubMenu;

export default class MapLayout extends React.Component<MapProps, MapState> {

  state = {
    collapsed: true,
    map: undefined,
    center: undefined,
  };
  map: google.maps.Map | undefined;
  center: { lat: number; lng: number; noWrap?: boolean } | undefined;

  constructor(props: MapProps) {
    super(props);

    this.mapLoaded = this.mapLoaded.bind(this);
    this.setCenter = this.setCenter.bind(this)
  }

  onCollapse = (collapsed: boolean) => {
    this.setState({ collapsed });
  }

  mapLoaded(loadedmap: typeof google.maps.Map, center: { lat: number; lng: number; noWrap?: boolean }) {
    // tslint:disable-next-line:no-console
    console.log("now in mpaloades before set map is", loadedmap)
    this.setState({
      map: loadedmap,
      center: center,
    // tslint:disable-next-line:no-console
    }, () => {
      this.map = this.state.map
      this.center = this.state.center
    })
  }

  setCenter() {
    if(this.map && this.center) {
      this.map.setCenter(this.center)
    }
  }

  renderChildren() {
    const { children } = this.props;

    if (!children) {
      return;
    }

    return React.Children.map(children, c => {
      if (!c) {
        return;
      }
      return React.cloneElement(c as React.ReactElement<any>, {
        mapLoaded: this.mapLoaded,
      });
    });
  }

  render() {
    const props = Object.assign({}, this.props, {
      map: this.state.map,
      center: this.state.center,
      setCenter: this.setCenter,
    });

    // tslint:disable-next-line:no-console
    console.log('props in layout render is', props)

    return (
      <Layout className="layout">
        <Content className="content">
          {this.renderChildren()}
        </Content>
        <Sider
          theme="light"
          className="sider"
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
          reverseArrow
          {...this.props}
        >
          <div className="logo" />
          <Menu theme="light" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="files">
              <Icon type="file" />
              <span>Files</span>
            </Menu.Item>
            <SubMenu
              key="basictools"
              title={
                <span><Icon type="tool" />
                  <span>Basic tools</span>
                </span>
                }
            >
              <MapTool {...props}/>
            </SubMenu>
            <Menu.Item
              key="drawer"
              disabled
            >
              <Icon type="edit" />
              <span>Drawer</span>
            </Menu.Item>
          </Menu>
        </Sider>
      </Layout>
    );
  }
}
