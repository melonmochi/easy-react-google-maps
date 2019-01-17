import * as React from 'react';
import { camelCase } from '../utils';
import { mapEvents } from 'utils';
import { MapTypeId, GestureHandlingType, Stop } from 'typings';
import './style';
import { Marker, InfoWindow, MarkerContextMenu } from 'components';
import { Spin } from 'antd';

const MarkerClusterer = require('@google/markerclustererplus');

export interface MapProps {
  google?: typeof google;
  onCheckedStopsList?: Stop[];
  mapLoaded?: (loadedmap: google.maps.Map, center: google.maps.LatLng) => void;
  setBounds?: (markersArray: google.maps.Marker[]) => void;
  resetBounds?: () => void;
  onCheckStops?: (newShownStopsList: Stop[]) => void;
  type?: MapTypeId;
  zoom?: number;
  backgroundColor?: string;
  initialCenter?: { lat: number; lng: number; noWrap?: boolean };
  gestureHandling?: GestureHandlingType;
  mapStyle?: React.CSSProperties;
  markerClustering?: boolean;
  mapEvtHandlers?: {
    [evtName: string]: (evtName: string, e: google.maps.event, map: google.maps.Map) => void;
  };
}

export interface MapState {
  center: google.maps.LatLng;
  selectedMarker?: google.maps.Marker;
  onLoadedData?: { [key: string]: any };
}

export default class Map extends React.Component<MapProps, MapState> {
  static defaultProps = {
    onCheckedStopsList: [] as Array<Stop>,
    markerClustering: true,
  };

  map: google.maps.Map;
  markersClusterer: MarkerClusterer;

  private mapRef = React.createRef<HTMLDivElement>();

  constructor(props: MapProps) {
    super(props);
    this.selectThisMarker = this.selectThisMarker.bind(this);
    this.handleEvent = this.handleEvent.bind(this);
    this.addThisMarkerToClusterer = this.addThisMarkerToClusterer.bind(this);
    this.removeThisMarkerToClusterer = this.removeThisMarkerToClusterer.bind(this);
    this.resetBounds = this.resetBounds.bind(this);

    const { initialCenter } = this.props;

    this.state = {
      center: initialCenter
        ? new google.maps.LatLng(
            initialCenter.lat,
            initialCenter.lng,
            initialCenter.noWrap ? initialCenter.noWrap : true
          )
        : new google.maps.LatLng(40.416778, -3.703778),
      selectedMarker: undefined,
    };
  }

  componentDidMount() {
    this.loadMap();
    const { map, markersClusterer } = this;
    const { mapLoaded, onCheckedStopsList } = this.props;

    console.log('im in didmount map, onCheckedStopsList is', onCheckedStopsList);
    if (map && mapLoaded) {
      mapLoaded(map, this.state.center);
    }
    if (map && !markersClusterer) {
      this.markersClusterer = new MarkerClusterer(map, []);
    }
  }

  addThisMarkerToClusterer(marker: google.maps.Marker) {
    const { setBounds } = this.props;
    this.markersClusterer.addMarker(marker);
    if (setBounds) {
      setBounds(this.markersClusterer.getMarkers());
    }
  }

  removeThisMarkerToClusterer(marker: google.maps.Marker) {
    const { setBounds } = this.props;
    this.markersClusterer.removeMarker(marker);
    if (setBounds) {
      setBounds(this.markersClusterer.getMarkers());
    }
  }

  resetBounds = () => {
    const { setBounds } = this.props;
    if (setBounds) {
      setBounds(this.markersClusterer.getMarkers());
    }
  };

  selectThisMarker = (marker: google.maps.Marker) => {
    this.setState({
      selectedMarker: marker,
    });
  };

  handleEvent(evt: string) {
    return (e: google.maps.MouseEvent) => {
      const evtName = `on${camelCase(evt)}`;
      const { mapEvtHandlers } = this.props;
      if (mapEvtHandlers && mapEvtHandlers[evtName]) {
        mapEvtHandlers[evtName](evtName, e, this.map);
      } else {
        this.defaultMapEventHandler(evtName, e, this.map);
      }
    };
  }

  defaultMapEventHandler(evtName: string, _e: google.maps.event, _map: google.maps.Map) {
    switch (evtName) {
      case 'onClick':
        this.setState({ selectedMarker: undefined });
        break;
      case 'onDblclick':
        this.setState({ selectedMarker: undefined });
        break;
      case 'onRightclick':
        this.setState({ selectedMarker: undefined });
        break;
      default:
      // throw new Error('No corresponding event')
    }
  }

  loadMap() {
    if (this.props && this.props.google) {
      // checks to make sure that props have been passed
      const { google } = this.props;
      const { maps } = google;

      const node = this.mapRef.current; // finds the 'map' div in the React DOM, names it node

      const mapConfig: object = Object.assign(
        {},
        {
          center: this.state.center,
          gestureHandling: this.props.gestureHandling,
          mapTypeId: this.props.type, // optional main map layer. Terrain, satellite, hybrid or roadmap--if unspecified, defaults to roadmap.
          zoom: this.props.zoom, // sets zoom. Lower numbers are zoomed further out.
          mapTypeControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT,
          },
          fullscreenControlOptions: {
            position: google.maps.ControlPosition.RIGHT_TOP,
          },
        }
      );

      this.map = new maps.Map(node, mapConfig); // creates a new Google map on the specified node (ref='map') with the specified configuration set above.
      mapEvents.forEach(e => {
        this.map.addListener(e, this.handleEvent(e));
      });
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
        center: this.state.center,
        google: this.props.google,
        map: this.map,
        selectThisMarker: this.selectThisMarker,
        selectedMarker: this.state.selectedMarker,
        addThisMarkerToClusterer: this.addThisMarkerToClusterer,
        removeThisMarkerToClusterer: this.removeThisMarkerToClusterer,
        resetBounds: this.resetBounds,
      });
    });
  }

  renderMarker = (stop: Stop) => {
    return (
      <Marker
        google={this.props.google}
        map={this.map}
        key={stop.stop_id}
        title={stop.stop_name}
        position={{ lat: parseFloat(stop.stop_lat), lng: parseFloat(stop.stop_lon) }}
        withLabel
        selectThisMarker={this.selectThisMarker}
        selectedMarker={this.state.selectedMarker}
        addThisMarkerToClusterer={this.addThisMarkerToClusterer}
        removeThisMarkerToClusterer={this.removeThisMarkerToClusterer}
        resetBounds={this.resetBounds}
      >
        <InfoWindow />
        <MarkerContextMenu />
      </Marker>
    );
  };

  renderMarkers = (onCheckedStopsList: Stop[]) => {
    const markerArray = onCheckedStopsList.map((stop: Stop) => this.renderMarker(stop));
    return markerArray;
  };

  public render() {
    let classNameContainer = 'defaultContainer';
    let classNameMap = 'defaultMap';
    if (this.props.mapStyle) {
      classNameContainer = 'container';
      classNameMap = 'map';
    }

    return (
      <div className={classNameContainer}>
        <div ref={this.mapRef} className={classNameMap} />
        <Spin
          tip="Loading Map..."
          spinning={this.map ? false : true}
          size="large"
          style={{ minHeight: 800 }}
        >
          <div style={{ height: '100%' }}>
            {this.map ? this.renderChildren() : null}
            {this.map && this.props.onCheckedStopsList
              ? this.renderMarkers(this.props.onCheckedStopsList)
              : null}
          </div>
        </Spin>
      </div>
    );
  }
}
