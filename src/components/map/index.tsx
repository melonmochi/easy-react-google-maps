import * as React from 'react';
import { camelCase } from '../utils';
import { evtNames } from './mapEvents';
import { MapTypeId, GestureHandlingType, Stop } from 'typings';
import './style';
import { Marker, InfoWindow, MarkerContextMenu } from 'components';

// tslint:disable-next-line:interface-name
export interface MapProps {
  google?: typeof google;
  type?: MapTypeId;
  zoom?: number;
  backgroundColor?: string;
  initialCenter?: { lat: number; lng: number; noWrap?: boolean };
  gestureHandling?: GestureHandlingType;
  mapStyle?: React.CSSProperties;
  markerClustering?: boolean;
  mapLoaded?: any;
  onSelectStops?: Stop[];
  [evtNames: string]: any;
}

// tslint:disable-next-line:interface-name
export interface MapState {
  center: { lat: number; lng: number; noWrap?: boolean };
  bounds: google.maps.LatLngBounds;
  selectedMarker?: google.maps.Marker;
  markers: Array<google.maps.Marker>;
  infoWindowVisible?: boolean;
  contextMenu?: boolean;
  clickLatLng?: google.maps.LatLng;
  newPosition?: { lat: number; lng: number; noWrap?: boolean };
  onLoadedData?: { [key: string]: any };
}

export default class Map extends React.Component<MapProps, MapState> {
  map: google.maps.Map;

  private mapRef = React.createRef<HTMLDivElement>();

  constructor(props: MapProps) {
    super(props);
    this.selectThisMarker = this.selectThisMarker.bind(this);
    this.defaultMarkerEventHandler = this.defaultMarkerEventHandler.bind(this);
    this.setBounds = this.setBounds.bind(this);
    this.resetBounds = this.resetBounds.bind(this);
    this.addThisMarker = this.addThisMarker.bind(this);

    this.state = {
      bounds: new google.maps.LatLngBounds(),
      center: this.props.initialCenter
        ? {
            lat: this.props.initialCenter.lat,
            lng: this.props.initialCenter.lng,
            noWrap: this.props.initialCenter.noWrap ? this.props.initialCenter.noWrap : true,
          }
        : {
            lat: 40.416778,
            lng: -3.703778,
          },
      selectedMarker: undefined,
      infoWindowVisible: undefined,
      contextMenu: undefined,
      clickLatLng: undefined,
      markers: [] as Array<google.maps.Marker>,
    };
  }

  componentDidMount() {
    this.loadMap();
    if (this.map) {
      this.props.mapLoaded(this.map, this.state.center, this.state.bounds);
    }
  }

  addThisMarker(marker: google.maps.Marker) {
    const { markers } = this.state;
    markers.push(marker);
    this.setState({
      markers,
    });
  }

  selectThisMarker(marker: google.maps.Marker) {
    this.setState({
      selectedMarker: marker,
      infoWindowVisible: false,
      contextMenu: false,
    });
  }

  handleEvent(evt: string) {
    return (e: google.maps.event) => {
      const evtName = `on${camelCase(evt)}`;
      if (this.props[evtName]) {
        this.props[evtName](this.props, this.map, e);
      } else {
        this.defaultEventHandler(evtName, e, this.map);
      }
    };
  }

  defaultEventHandler(evtName: string, _e: google.maps.event, _map: google.maps.Map) {
    switch (evtName) {
      case 'onClick':
        this.setState({ selectedMarker: undefined, infoWindowVisible: false, contextMenu: false });
        break;
      case 'onDblclick':
        this.setState({ selectedMarker: undefined, infoWindowVisible: false, contextMenu: false });
        break;
      case 'onRightclick':
        this.setState({ selectedMarker: undefined, infoWindowVisible: false, contextMenu: false });
        break;
      default:
      // throw new Error('No corresponding event')
    }
  }

  defaultMarkerEventHandler(
    evtName: string,
    e: google.maps.MouseEvent,
    marker: google.maps.Marker
  ) {
    switch (evtName) {
      case 'onClick':
        this.selectThisMarker(marker);
        this.setState({ infoWindowVisible: true });
        break;
      case 'onDblclick':
        this.selectThisMarker(marker);
        this.setState({ infoWindowVisible: false });
        break;
      case 'onRightclick':
        this.selectThisMarker(marker);
        this.setState({ contextMenu: true, clickLatLng: e.latLng });
        break;
      case 'onCloseinfowindow':
        this.setState({ infoWindowVisible: false });
        break;
      case 'onOpeninfowindow':
        this.setState({ infoWindowVisible: true });
        break;
      case 'onDrag':
        this.setState({
          clickLatLng: e.latLng,
        });
      case 'onDragend':
        this.selectThisMarker(marker);
        this.resetBounds();
        this.setState({
          newPosition: {
            lat: marker.getPosition().lat(),
            lng: marker.getPosition().lng(),
          },
        });
      default:
      // throw new Error('No corresponding event')
    }
  }

  setBounds = (pos: google.maps.LatLng) => {
    console.log('im in setBounds, pos is', this.state.bounds, typeof this.state.bounds, pos);
    this.setState({
      bounds: this.state.bounds.extend(pos),
    });
  };

  resetBounds() {
    this.setState({
      bounds: new google.maps.LatLngBounds(),
    });
  }

  addFileToData(name: string, file: Object) {
    const fileName: string = name;
    this.setState({
      onLoadedData: { ...this.state.onLoadedData, [fileName]: file },
    });
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
        }
      );

      this.map = new maps.Map(node, mapConfig); // creates a new Google map on the specified node (ref='map') with the specified configuration set above.
      this.forceUpdate();
      evtNames.forEach(e => {
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
        bounds: this.state.bounds,
        center: this.state.center,
        google: this.props.google,
        map: this.map,
        visibleInfoWindow: this.props.visibleInfoWindow,
        resetBounds: this.resetBounds,
        setBounds: this.setBounds,
        selectThisMarker: this.selectThisMarker,
        selectedMarker: this.state.selectedMarker,
        infoWindowVisible: this.state.infoWindowVisible,
        contextMenu: this.state.contextMenu,
        clickLatLng: this.state.clickLatLng,
        defaultMarkerEventHandler: this.defaultMarkerEventHandler,
        markers: this.state.markers,
        addThisMarker: this.addThisMarker,
      });
    });
  }

  renderMapMarkers(onSelectStops: Stop[]) {
    return onSelectStops.map((stop: Stop) => (
      <Marker
        title={stop.stop_name}
        position={{ lat: parseFloat(stop.stop_lat), lng: parseFloat(stop.stop_lon) }}
        withLabel
        label={stop.stop_name.charAt(0).toUpperCase()}
        animation="DROP"
        key={stop.stop_id}
        google={this.props.google}
        map={this.map}
        setBounds={this.setBounds}
        selectThisMarker={this.selectThisMarker}
        infoWindowVisible={this.state.infoWindowVisible}
        defaultMarkerEventHandler={this.defaultMarkerEventHandler}
        addThisMarker={this.addThisMarker}
      >
        <InfoWindow />
        <MarkerContextMenu />
      </Marker>
    ));
  }

  public render() {
    let classNameContainer = 'defaultContainer';
    let classNameMap = 'defaultMap';
    if (this.props.mapStyle) {
      classNameContainer = 'container';
      classNameMap = 'map';
    }

    const { onSelectStops } = this.props;

    return (
      <div className={classNameContainer}>
        <div ref={this.mapRef} className={classNameMap} />
        {this.map ? this.renderChildren() : <div>Loading map...</div>}
        {this.map && onSelectStops ? this.renderMapMarkers(onSelectStops) : null}
      </div>
    );
  }
}
