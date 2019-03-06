import * as React from 'react';

export interface InfoWindowProps {
  google?: typeof google;
  map?: google.maps.Map;
  marker?: google.maps.Marker;
  selectedMarker?: google.maps.Marker;
  onOpenInfoWindow?: any;
  onCloseInfoWindow?: any;
  handleInfoWindowState?: (evt: string) => void;
  infoWindowVisible?: boolean;
}

// tslint:disable-next-line:interface-name
export interface InfoWindowState {
  onInfoWindow: boolean;
}

export default class InfoWindow extends React.Component<InfoWindowProps, InfoWindowState> {
  state = {
    onInfoWindow: false,
  };

  infowindow: google.maps.InfoWindow;

  shouldComponentUpdate(prevProps: InfoWindowProps) {
    return (
      prevProps.infoWindowVisible !== this.props.infoWindowVisible ||
      prevProps.selectedMarker !== this.props.selectedMarker
    );
  }

  componentDidUpdate() {
    const { google, map, marker, selectedMarker, infoWindowVisible } = this.props;

    if (!google || !map || !marker) {
      return;
    }

    if (selectedMarker === marker && infoWindowVisible) {
      if (!this.infowindow) {
        this.createInfoWindow(marker);
        this.openInfoWindow(map, marker);
      }
      if (this.infowindow) {
        this.openInfoWindow(map, marker);
      }
    } else {
      if (this.infowindow) {
        this.closeInfoWindow();
      }
    }
  }

  createInfoWindow(marker: google.maps.Marker) {
    this.infowindow = new google.maps.InfoWindow({
      content: marker.getTitle(),
    });

    this.infowindow.addListener('closeclick', this.onCloseInfoWindow.bind(this));
  }

  onOpenInfoWindow() {
    if (this.props.onOpenInfoWindow) {
      this.props.onOpenInfoWindow();
    } else {
      const { marker, handleInfoWindowState } = this.props;
      if (marker && handleInfoWindowState) {
        handleInfoWindowState('onOpeninfowindow');
      }
    }
  }

  onCloseInfoWindow() {
    if (this.props.onCloseInfoWindow) {
      this.props.onCloseInfoWindow();
    } else {
      const { marker, handleInfoWindowState } = this.props;
      if (marker && handleInfoWindowState) {
        handleInfoWindowState('onCloseinfowindow');
      }
    }
  }

  openInfoWindow(map: google.maps.Map, marker: google.maps.Marker) {
    this.infowindow.open(map, marker);
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

  render() {
    return null;
  }
}
