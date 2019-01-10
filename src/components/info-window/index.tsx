import * as React from 'react';

// tslint:disable-next-line:interface-name
export interface InfoWindowProps {
  google?: typeof google;
  map?: google.maps.Map;
  marker?: google.maps.Marker;
  title?: string;
  position?: { lat: number; lng: number };
  visibleInfoWindows?: boolean;
  selectedMarker?: any;
  onOpenInfoWindow?: any;
  onCloseInfoWindow?: any;
  defaultEventHandler?: any;
  infoWindowVisible?: boolean;
}

// tslint:disable-next-line:interface-name
export interface InfoWindowState {
  onInfoWindow: boolean;
}

export default class InfoWindow extends React.Component<InfoWindowProps, InfoWindowState> {
  static defaultProps = {
    infoWindowVisible: false,
    visibleInfoWindows: true,
  };

  state = {
    onInfoWindow: false,
  };

  infowindow: google.maps.InfoWindow;

  componentDidMount() {
    this.renderInfoWindow();
  }

  componentDidUpdate(prevProps: InfoWindowProps) {
    const { google, map } = this.props;

    if (!google || !map) {
      return;
    }

    if (map !== prevProps.map) {
      this.renderInfoWindow();
    }

    if (this.props.position !== prevProps.position) {
      this.updatePosition();
    }

    if (
      this.props.visibleInfoWindows !== prevProps.visibleInfoWindows ||
      this.props.selectedMarker !== prevProps.selectedMarker ||
      this.props.infoWindowVisible !== prevProps.infoWindowVisible ||
      this.props.position !== prevProps.position
    ) {
      this.props.selectedMarker === this.props.marker &&
      this.props.visibleInfoWindows &&
      this.props.infoWindowVisible
        ? this.openInfoWindow()
        : this.closeInfoWindow();
    }
  }

  renderInfoWindow() {
    const { google, map, marker, title } = this.props;

    if (!google || !map || !marker || !title) {
      return;
    }

    this.infowindow = new google.maps.InfoWindow({
      content: title,
    });

    this.infowindow.addListener('domready', this.onOpenInfoWindow.bind(this));
    this.infowindow.addListener('closeclick', this.onCloseInfoWindow.bind(this));
  }

  onOpenInfoWindow() {
    if (this.props.onOpenInfoWindow) {
      this.props.onOpenInfoWindow();
    } else {
      this.props.defaultEventHandler('onOpeninfowindow');
    }
  }

  onCloseInfoWindow() {
    if (this.props.onCloseInfoWindow) {
      this.props.onCloseInfoWindow();
    } else {
      this.props.defaultEventHandler('onCloseinfowindow');
    }
  }

  openInfoWindow() {
    this.infowindow.open(this.props.map, this.props.marker);
    this.setState({
      onInfoWindow: true,
    });
  }

  closeInfoWindow() {
    this.infowindow.close();
    this.setState({
      onInfoWindow: false,
    });
  }

  updatePosition() {
    const { position } = this.props;
    let pos: google.maps.LatLng;
    if (position) {
      if (!(position instanceof google.maps.LatLng)) {
        pos = new google.maps.LatLng(position.lat, position.lng);
      } else {
        pos = position;
      }
      this.infowindow.setPosition(pos);
    }
  }

  render() {
    return null;
  }
}
