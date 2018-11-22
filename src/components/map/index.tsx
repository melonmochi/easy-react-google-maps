import * as React from 'react';
import './style';

export type MapTypeId = 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
export type GestureHandlingType = 'cooperative' | 'greedy' | 'none' | 'auto';

// tslint:disable-next-line:interface-name
export interface MapProps {
  google?: typeof google
  type?: MapTypeId
  zoom?: number
  backgroundColor?: string;
  initialCenter?: { lat: number; lng: number; noWrap?: boolean }
  gestureHandling?: GestureHandlingType
  mapStyle?: React.CSSProperties
  mapLoaded?: any
}

// tslint:disable-next-line:interface-name
export interface MapState {
  center: { lat: number; lng: number; noWrap?: boolean };
  bounds: google.maps.LatLngBounds;
}

export default class Map extends React.Component<MapProps, MapState> {
  map: google.maps.Map;

  state = {
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
  };

  private mapRef = React.createRef<HTMLDivElement>();

  constructor(props: MapProps) {
    super(props);

    this.setBounds = this.setBounds.bind(this);
    this.resetBounds = this.resetBounds.bind(this);
  }

  componentDidMount() {
    this.loadMap();
    if(this.map) {
      this.props.mapLoaded(this.map, this.state.center, this.state.bounds);
    }
  }

  setBounds(pos: google.maps.LatLng) {
    this.setState({
      bounds: this.state.bounds.extend(pos),
    });
  }

  resetBounds() {
    this.setState({
      bounds: new google.maps.LatLngBounds(),
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
        },
      );

      this.map = new maps.Map(node, mapConfig); // creates a new Google map on the specified node (ref='map') with the specified configuration set above.
      this.forceUpdate();
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
        resetBounds: this.resetBounds,
        setBounds: this.setBounds,
      });
    });
  }

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
        {this.map ? this.renderChildren() : <div>Loading map...</div>}
      </div>
    );
  }
}
