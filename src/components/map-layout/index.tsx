import * as React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { MapTool, Uploader, UploadedDataList } from 'components'
import { GTFSFile } from 'typings'
import './style';

export interface MapLayoutProps {
  google?: typeof google
  map?: typeof google.maps.Map
  center?: google.maps.LatLng
}

export interface MapLayoutState {
  google?: typeof google
  map?: typeof google.maps.Map
  center?: { lat: number; lng: number; noWrap?: boolean }
  collapsed?: boolean
  bounds?: google.maps.LatLngBounds;
  onLoadedData?: GTFSFile
}

const { Content, Sider } = Layout;
const SubMenu = Menu.SubMenu;

export default class MapLayout extends React.Component<MapLayoutProps, MapLayoutState> {

  state = {
    collapsed: false,
    map: undefined,
    center: undefined,
    bounds: undefined,
    onLoadedData: {},
  };

  map: google.maps.Map | undefined;
  center: { lat: number; lng: number; noWrap?: boolean } | undefined;
  bounds: google.maps.LatLngBounds | undefined;

  constructor(props: MapLayoutProps) {
    super(props);

    this.mapLoaded = this.mapLoaded.bind(this);
    this.setCenter = this.setCenter.bind(this);
    this.fitBounds = this.fitBounds.bind(this);
    this.addFileToData = this.addFileToData.bind(this);
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

  addFileToData(name: string, file: Object) {
    const fileName: string = name;
    this.setState({
      onLoadedData: { ...this.state.onLoadedData, [fileName]: file },
    })
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
      addFileToData: this.addFileToData,
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
            defaultOpenKeys={['files', 'data']}
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
              <Uploader {...props}/>
            </SubMenu>
            <SubMenu
              key="data"
              title={
                <span><Icon type="database" />
                  <span>Data</span>
                </span>
              }
              disabled={Object.keys(this.state.onLoadedData).length === 0}
            >
              {this.state.onLoadedData? <UploadedDataList onLoadedData={this.state.onLoadedData}/>: null}
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
