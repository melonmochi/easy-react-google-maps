import * as React from 'react';
import { markerEvents, camelCase } from 'utils';

export interface MarkerProps {
  google?: typeof google;
  map?: google.maps.Map;
  title: string;
  position: { lat: number; lng: number; noWrap?: boolean };
  draggable?: boolean;
  label?: string;
  withLabel?: boolean;
  animation?: 'DROP' | 'BOUNCE';
  selectedMarker?: google.maps.Marker;
  markerEvtHandlers?: {
    [evtName: string]: (evtName: string, e: google.maps.event, marker: google.maps.Marker) => void;
  };
  newPosition?: { lat: number; lng: number; noWrap?: boolean };
  selectThisMarker?: (marker: google.maps.Marker) => void;
  addThisMarkerToClusterer?: (marker: google.maps.Marker) => void;
  removeThisMarkerToClusterer?: (marker: google.maps.Marker) => void;
  resetBounds?: () => void;
}

export type MarkerState = {
  clickLatLng?: google.maps.LatLng;
  thisInfoWindowVisible: boolean;
  thisContextMenuVisible: boolean;
};

export default class Marker extends React.Component<MarkerProps, MarkerState> {
  state = {
    clickLatLng: undefined,
    thisInfoWindowVisible: false,
    thisContextMenuVisible: false,
  };

  marker: google.maps.Marker;

  componentDidMount() {
    this.renderMarker();
  }

  componentWillUnmount() {
    const { marker } = this;
    marker.setMap(null);

    const { removeThisMarkerToClusterer } = this.props;

    if (removeThisMarkerToClusterer) {
      removeThisMarkerToClusterer(marker);
    }
  }

  handleInfoWindowState = (evt: string) => {
    switch (evt) {
      case 'onCloseinfowindow':
        this.setState({ thisInfoWindowVisible: false });
        break;
      case 'onOpeninfowindow':
        this.setState({ thisInfoWindowVisible: true });
        break;
      default:
      // throw new Error('No corresponding event')
    }
  };

  handleMarkerEvent = (evt: string, marker: google.maps.Marker) => {
    return (e: google.maps.MouseEvent) => {
      const evtName = `on${camelCase(evt)}`;
      const { markerEvtHandlers } = this.props;
      if (markerEvtHandlers && markerEvtHandlers[evtName]) {
        markerEvtHandlers[evtName](evtName, e, marker);
      } else {
        this.defaultMarkerEventHandler(evtName, e, marker);
      }
    };
  };

  defaultMarkerEventHandler(
    evtName: string,
    e: google.maps.MouseEvent,
    marker: google.maps.Marker
  ) {
    const { selectThisMarker, resetBounds } = this.props;
    if (selectThisMarker && resetBounds) {
      switch (evtName) {
        case 'onClick':
          if (marker !== this.props.selectedMarker) {
            selectThisMarker(marker);
          }
          this.setState({
            thisInfoWindowVisible: true,
            thisContextMenuVisible: false,
            clickLatLng: e.latLng,
          });
          break;
        case 'onDblclick':
          if (marker !== this.props.selectedMarker) {
            selectThisMarker(marker);
          }
          this.setState({
            thisInfoWindowVisible: false,
            thisContextMenuVisible: false,
            clickLatLng: e.latLng,
          });
          break;
        case 'onRightclick':
          if (marker !== this.props.selectedMarker) {
            selectThisMarker(marker);
          }
          selectThisMarker(marker);
          this.setState({
            thisInfoWindowVisible: false,
            thisContextMenuVisible: true,
            clickLatLng: e.latLng,
          });
          break;
        case 'onDrag':
          this.setState({
            thisInfoWindowVisible: false,
            thisContextMenuVisible: false,
            clickLatLng: e.latLng,
          });
        case 'onDragend':
          resetBounds();
          selectThisMarker(marker);
          marker.setPosition({
            lat: marker.getPosition().lat(),
            lng: marker.getPosition().lng(),
          });
          this.setState({
            clickLatLng: e.latLng,
          });
        default:
        // throw new Error('No corresponding event')
      }
    }
  }

  renderMarker() {
    const {
      google,
      map,
      title,
      withLabel,
      draggable,
      animation,
      addThisMarkerToClusterer,
    } = this.props;

    let { label } = this.props;

    if (!google || !map) {
      return;
    } else {
      const markerPosition = this.props.newPosition ? this.props.newPosition : this.props.position;

      if (!label) {
        label = title;
      }

      if (label.length > 2) {
        const splitedLabel = label.split(' ');
        if (splitedLabel.length > 1) {
          label = splitedLabel[0].charAt(0) + splitedLabel[1].charAt(0);
        } else {
          label = splitedLabel[0].substr(0, 2);
        }
      }

      const markerOpt = {
        animation: animation ? google.maps.Animation[animation] : undefined,
        draggable,
        label: withLabel ? label : undefined,
        map,
        position: markerPosition,
        title,
      };

      this.marker = new google.maps.Marker(markerOpt);

      this.marker.setMap(map);

      if (addThisMarkerToClusterer) {
        addThisMarkerToClusterer(this.marker);
      }

      markerEvents.forEach(e => {
        const { marker, handleMarkerEvent } = this;
        marker.addListener(e, handleMarkerEvent(e, marker));
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
        handleMarkerEvent: this.handleMarkerEvent.bind(this),
        handleInfoWindowState: this.handleInfoWindowState.bind(this),
        google: this.props.google,
        map: this.props.map,
        marker: this.marker,
        position: this.props.position,
        title: this.props.title,
        selectedMarker: this.props.selectedMarker,
        infoWindowVisible:
          this.props.selectedMarker === this.marker && this.state.thisInfoWindowVisible
            ? true
            : false,
        contextMenuVisible:
          this.props.selectedMarker === this.marker && this.state.thisContextMenuVisible
            ? true
            : false,
        clickLatLng: this.state.clickLatLng,
      });
    });
  }

  render() {
    return <div>{this.renderChildren()}</div>;
  }
}
