import * as React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { MapTool, Uploader, CalendarList, NetworkList, StopsList } from 'components';
import { Calendar, CalendarDate, Stop } from 'typings';
import './style';

import * as csv from 'csvtojson';

const CalendarFiles = ['calendar', 'calendar_dates'];

export interface MapLayoutProps {
  google?: typeof google;
  map?: typeof google.maps.Map;
  center?: google.maps.LatLng;
}

export type MapLayoutState = {
  google?: typeof google;
  map?: typeof google.maps.Map;
  center?: {
    lat: number;
    lng: number;
    noWrap?: boolean;
  };
  collapsed?: boolean;
  bounds?: google.maps.LatLngBounds;
  calendarInfo?: {
    calendar?: Calendar[];
    calendar_dates?: CalendarDate[];
  };
  onLoadedStops?: Stop[];
  onSelectStops?: Stop[];
  stopsCollapsed: boolean;
};

const { Content, Sider } = Layout;
const SubMenu = Menu.SubMenu;

export default class MapLayout extends React.Component<MapLayoutProps, MapLayoutState> {
  state = {
    collapsed: false,
    map: undefined,
    center: undefined,
    bounds: undefined,
    calendarInfo: {},
    onLoadedStops: [],
    onSelectStops: [],
    stopsCollapsed: true,
  };

  map: google.maps.Map | undefined;
  center: { lat: number; lng: number; noWrap?: boolean } | undefined;
  bounds: google.maps.LatLngBounds | undefined;

  constructor(props: MapLayoutProps) {
    super(props);

    this.mapLoaded = this.mapLoaded.bind(this);
    this.setCenter = this.setCenter.bind(this);
    this.fitBounds = this.fitBounds.bind(this);
    this.onSelectGTFSFile = this.onSelectGTFSFile.bind(this);
    this.onCheckStopsList = this.onCheckStopsList.bind(this);
    this.onCheckStops = this.onCheckStops.bind(this);
  }

  onCollapse = (collapsed: boolean) => {
    this.setState({ collapsed });
  };

  onCheckStops = (stopsList: Stop[]) => {
    this.setState({
      onSelectStops: stopsList,
    });
  };

  onCheckStopsList = (stopsCollapsed: boolean) => {
    this.setState({ stopsCollapsed });
  };

  mapLoaded(
    loadedmap: typeof google.maps.Map,
    center: { lat: number; lng: number; noWrap?: boolean },
    bounds: google.maps.LatLngBounds
  ) {
    this.setState(
      {
        map: loadedmap,
        center: center,
        bounds: bounds,
      },
      () => {
        this.map = this.state.map;
        this.center = this.state.center;
        this.bounds = this.state.bounds;
      }
    );
  }

  setCenter() {
    if (this.map && this.center) {
      this.map.setCenter(this.center);
    }
  }

  fitBounds() {
    if (this.map && this.bounds) {
      this.map.fitBounds(this.bounds);
    }
  }

  onSelectGTFSFile(onSelectFile: any) {
    this.LoadCalendars(onSelectFile);
    this.LoadStops(onSelectFile);
  }

  LoadCalendars(onSelectFile: { [key: string]: string }) {
    this.setState({
      calendarInfo: undefined,
    });
    Object.keys(onSelectFile)
      .filter((key: string) => CalendarFiles.includes(key))
      .map((key: string) => {
        csv()
          .fromString(onSelectFile[key])
          .then((json: object) => {
            this.setState({
              calendarInfo: {
                ...this.state.calendarInfo,
                [key]: json,
              },
            });
          });
      });
  }

  LoadStops(onSelectFile: { [key: string]: string }) {
    this.setState({
      onLoadedStops: undefined,
    });

    const stopsFile = Object.keys(onSelectFile)
      .filter((key: string) => key === 'stops')
      .map((key: string) => onSelectFile[key])[0];

    csv()
      .fromString(stopsFile)
      .then((json: Stop[]) => {
        this.setState({
          onLoadedStops: json,
        });
      });
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
        onSelectStops: this.state.onSelectStops,
      });
    });
  }

  render() {
    const props = Object.assign({}, this.props, {
      map: this.state.map,
      center: this.state.center,
      setCenter: this.setCenter,
      fitBounds: this.fitBounds,
      onSelectGTFSFile: this.onSelectGTFSFile,
    });

    const { calendarInfo, onLoadedStops } = this.state;

    console.log('im in render layout, onSelectStops is', this.state.onSelectStops);

    return (
      <Layout className="layout">
        <Content className="content">{this.renderChildren()}</Content>
        <Sider
          theme="light"
          className="sider"
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
          reverseArrow
          width={300}
          {...this.props}
        >
          <div className="logo" />
          <Menu theme="light" defaultOpenKeys={['files', 'data']} mode="inline">
            <SubMenu
              key="files"
              title={
                <span>
                  <Icon type="file" />
                  <span>Files</span>
                </span>
              }
            >
              <Uploader {...props} />
            </SubMenu>
            <SubMenu
              key="data"
              title={
                <span>
                  <Icon type="database" />
                  <span>Data</span>
                </span>
              }
              disabled={!calendarInfo}
            >
              {calendarInfo ? <CalendarList calendarInfo={calendarInfo} /> : null}
            </SubMenu>
            <SubMenu
              key="network"
              title={
                <span>
                  <Icon type="cluster" />
                  <span>Network</span>
                </span>
              }
              disabled={!onLoadedStops || onLoadedStops.length === 0}
            >
              {onLoadedStops ? (
                <NetworkList
                  onLoadedStops={onLoadedStops}
                  onCheckStopsList={this.onCheckStopsList}
                />
              ) : null}
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
              <MapTool {...props} />
            </SubMenu>
            <Menu.Item key="drawer" disabled>
              <Icon type="edit" />
              <span>Drawer</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Sider
          theme="light"
          className="sider-stopslist"
          collapsedWidth={0}
          collapsed={this.state.stopsCollapsed}
          onCollapse={this.onCheckStopsList}
          reverseArrow
          trigger={null}
          width={400}
          {...this.props}
        >
          {onLoadedStops ? (
            <StopsList onLoadedStops={onLoadedStops} onCheckStops={this.onCheckStops} />
          ) : null}
        </Sider>
      </Layout>
    );
  }
}
