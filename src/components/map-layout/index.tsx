import * as React from 'react';
import { Layout, Menu, Icon, Spin } from 'antd';
import { MapTool, Uploader, CalendarList, NetworkList, StopsList } from 'components';
import { Calendar, CalendarDate, Stop } from 'typings';
import './style';

import * as csv from 'csvtojson';

const CalendarFiles = ['calendar', 'calendar_dates'];

export interface MapLayoutProps {
}

export interface MapLayoutState {
  map?: google.maps.Map;
  bounds: google.maps.LatLngBounds;
  center?: google.maps.LatLng;
  collapsed?: boolean;
  calendarInfo?: {
    calendar?: Calendar[];
    calendar_dates?: CalendarDate[];
  };
  onLoadedStopsList?: Stop[];
  onCheckedStopsList?: Stop[];
  stopsCollapsed: boolean;
  uploading: boolean;
};

const { Content, Sider } = Layout;
const SubMenu = Menu.SubMenu;

export default class MapLayout extends React.Component<MapLayoutProps, MapLayoutState> {
  state = {
    map: undefined,
    bounds: new google.maps.LatLngBounds(),
    center: undefined,
    collapsed: false,
    calendarInfo: {},
    onLoadedStopsList: [],
    onCheckedStopsList: [],
    stopsCollapsed: true,
    uploading: false,
  };

  map: google.maps.Map | undefined

  constructor(props: MapLayoutProps) {
    super(props);

    this.mapLoaded = this.mapLoaded.bind(this);
    this.setCenter = this.setCenter.bind(this);
    this.fitBounds = this.fitBounds.bind(this);
    this.setBounds = this.setBounds.bind(this);
    this.onSelectGTFSFile = this.onSelectGTFSFile.bind(this);
    this.onShowStopsList = this.onShowStopsList.bind(this);
    this.onCheckStops = this.onCheckStops.bind(this);
  }

  onCollapse = (collapsed: boolean) => {
    this.setState({ collapsed });
  };

  onCheckStops = (newOnCheckedStopsList: Stop[]) => {
    this.setState({
      onCheckedStopsList: newOnCheckedStopsList,
    });
  };

  onShowStopsList = (stopsCollapsed: boolean) => {
    this.setState({ stopsCollapsed });
  };

  mapLoaded = (
    map: google.maps.Map,
    center: google.maps.LatLng,
    ) => {
      this.setState({
        map: map,
        center: center,
      }, () => {
        this.map = this.state.map
      })
    };

  setCenter = () => {
    const { center } = this.state
    if(this.map && center) {
      this.map.setCenter(center)
    }
  }

  setBounds = (markersArray: google.maps.Marker[]) => {
    const emptyBounds = new google.maps.LatLngBounds()
    markersArray.forEach((m: google.maps.Marker) => emptyBounds.extend(m.getPosition()))
    this.setState({
      bounds: emptyBounds,
    }, () => {
      this.fitBounds()
    })
  };

  fitBounds() {
    if (this.map) {
      this.map.fitBounds(this.state.bounds);
    }
  }

  onSelectGTFSFile = (onSelectFile: any) => {
    this.setState({
      uploading: true,
    })
    this.LoadData(onSelectFile);
  }

  LoadData = (onSelectFile: any) => {
    this.setState({
      calendarInfo: undefined,
      onLoadedStopsList: undefined,
      onCheckedStopsList: undefined,
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

    const stopsFile = Object.keys(onSelectFile)
      .filter((key: string) => key === 'stops')
      .map((key: string) => onSelectFile[key])[0];

    csv()
      .fromString(stopsFile)
      .then((json: Stop[]) => {
        this.setState({
          onLoadedStopsList: json,
          onCheckedStopsList: json,
          uploading: false,
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
        map: this.state.map,
        center: this.state.center,
        setCenter: this.setCenter,
        setBounds: this.setBounds,
        mapLoaded: this.mapLoaded,
        onCheckedStopsList: this.state.onCheckedStopsList,
        onCheckStops:this.onCheckStops,
      });
    });
  }

  render() {
    const props = Object.assign({}, this.props, {
      map: this.state.map,
      center: this.state.center,
      setCenter: this.setCenter,
      fitBounds: this.fitBounds,
      setBounds: this.setBounds,
      onSelectGTFSFile: this.onSelectGTFSFile,
    });

    const { calendarInfo, onLoadedStopsList } = this.state;

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
          width={300}
          {...this.props}
        >
          <Spin spinning={this.state.uploading}>
            <div className="logo" />
            <Menu
              theme="light"
              defaultOpenKeys={['files', 'data']}
              mode="inline"
              style={{ borderRight: 0 }}
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
                disabled={!onLoadedStopsList || onLoadedStopsList.length === 0}
              >
                {onLoadedStopsList ? (
                  <NetworkList
                    onLoadedStops={onLoadedStopsList}
                    onShowStopsList={this.onShowStopsList}
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
                disabled={!this.state.map}
              >
                <MapTool
                  map={this.state.map}
                  setCenter={this.setCenter}
                  fitBounds={this.fitBounds}
                />
              </SubMenu>
              <Menu.Item key="drawer" disabled>
                <Icon type="edit" />
                <span>Drawer</span>
              </Menu.Item>
            </Menu>
          </Spin>
        </Sider>
        <Sider
          theme="light"
          className="sider-stopslist"
          collapsedWidth={0}
          collapsed={this.state.stopsCollapsed}
          onCollapse={this.onShowStopsList}
          reverseArrow
          trigger={null}
          width={400}
          {...this.props}
        >
          {onLoadedStopsList ? (
            <StopsList
              onLoadedStopsList={onLoadedStopsList}
              onCheckStops={this.onCheckStops}
            />
          ) : null}
        </Sider>
      </Layout>
    );
  }
}
