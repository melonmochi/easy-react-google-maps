import React from 'react';
const MarkerClusterer = require('@google/markerclustererplus');

export interface MarkerClustererProps {
  google?: typeof google;
  map?: google.maps.Map;
  visibleInfoWindow?: boolean;
  bounds?: google.maps.LatLngBounds;
  setBounds?: any;
  resetBounds?: any;
  selectedMarker?: google.maps.Marker;
  selectThisMarker?: any;
  infoWindowVisible?: boolean;
  contextMenu?: boolean;
  clickLatLng?: google.maps.LatLng;
  defaultMarkerEventHandler?: any;
  newPosition?: { lat: number; lng: number; noWrap?: boolean };
  addThisMarker?: any;
  markers?: Array<google.maps.Marker>;
  [evtNames: string]: any;
}

export interface MarkerClustererState {
  markerClusterer: any;
}

export default class MarkerClusterering extends React.PureComponent<
  MarkerClustererProps,
  MarkerClustererState
> {
  constructor(props: MarkerClustererProps) {
    super(props);
    this.state = {
      markerClusterer: undefined,
    };
  }

  componentDidMount() {
    const markerClusterer = new MarkerClusterer(this.props.map, this.props.markers, {
      imagePath:
        'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
    });
    this.setState({
      markerClusterer: markerClusterer,
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
        bounds: this.props.bounds,
        center: this.props.center,
        google: this.props.google,
        map: this.props.map,
        visibleInfoWindow: this.props.visibleInfoWindow,
        resetBounds: this.props.resetBounds,
        setBounds: this.props.setBounds,
        selectThisMarker: this.props.selectThisMarker,
        selectedMarker: this.props.selectedMarker,
        infoWindowVisible: this.props.infoWindowVisible,
        contextMenu: this.props.contextMenu,
        clickLatLng: this.props.clickLatLng,
        defaultMarkerEventHandler: this.props.defaultMarkerEventHandler,
        addThisMarker: this.props.addThisMarker,
        markers: this.props.markers,
      });
    });
  }

  render() {
    return this.renderChildren();
  }
}
