import * as React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { MapTool, Uploader } from 'components'
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
  bounds?: google.maps.LatLngBounds;
}

const { Content, Sider } = Layout;
const SubMenu = Menu.SubMenu;

export default class MapLayout extends React.Component<MapProps, MapState> {

  state = {
    collapsed: true,
    map: undefined,
    center: undefined,
    bounds: undefined,
  };

  map: google.maps.Map | undefined;
  center: { lat: number; lng: number; noWrap?: boolean } | undefined;
  bounds: google.maps.LatLngBounds | undefined;

  constructor(props: MapProps) {
    super(props);

    this.mapLoaded = this.mapLoaded.bind(this);
    this.setCenter = this.setCenter.bind(this);
    this.fitBounds = this.fitBounds.bind(this);
  }

  onCollapse = (collapsed: boolean) => {
    this.setState({ collapsed });
  }

  mapLoaded(
    loadedmap: typeof google.maps.Map,
    center: { lat: number; lng: number; noWrap?: boolean },
    bounds: google.maps.LatLngBounds,
    ) {
    this.setState({
      map: loadedmap,
      center: center,
      bounds: bounds,
    }, () => {
      this.map = this.state.map
      this.center = this.state.center
      this.bounds = this.state.bounds
    })
  }

  setCenter() {
    if(this.map && this.center) {
      this.map.setCenter(this.center)
    }
  }

  fitBounds() {
    if(this.map && this.bounds) {
      this.map.fitBounds(this.bounds)
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
      fitBounds: this.fitBounds,
    });

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
          <Menu
            theme="light"
            defaultSelectedKeys={['basictools']}
            mode="inline"
          >
            <SubMenu
              key="files"
              title={
                <span><Icon type="file" />
                  <span>Files</span>
                </span>
                }
            >
              <Uploader />
            </SubMenu>
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
