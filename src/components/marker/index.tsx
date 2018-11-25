import * as React from 'react';
import { camelCase } from '../utils';
import { evtNames }from './markerEvents'

// tslint:disable-next-line:interface-name
export interface MarkerProps {
  google?: typeof google;
  map?: google.maps.Map;
  title: string;
  position: { lat: number; lng: number; noWrap?: boolean };
  draggable?: boolean;
  label?: string;
  withLabel?: boolean;
  animation?: 'DROP' | 'BOUNCE';
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
  [evtNames: string]: any;
}

export default class Marker extends React.Component<MarkerProps, any> {
  static defaultProps = {
    draggable: true,
    visibleInfoWindow: true,
    withLabel: false,
  };

  marker: google.maps.Marker;

  constructor(props: MarkerProps) {
    super(props);

    this.defaultEventHandler = this.defaultEventHandler.bind(this);
  }

  componentDidMount() {
    this.renderMarker();
  }

  handleEvent(evt: string) {
    return (e: google.maps.MouseEvent) => {
      const evtName = `on${camelCase(evt)}`;
      if (this.props[evtName]) {
        this.props[evtName](this.props, this.marker, e);
      } else {
        this.defaultEventHandler(evtName, e, this.marker);
      }
    };
  }

  defaultEventHandler(evtName: string, e: google.maps.MouseEvent, marker: google.maps.Marker) {
    this.props.defaultMarkerEventHandler(evtName, e, marker)
  }

  async renderMarker() {
    const { google, map, title, withLabel, draggable, animation } = this.props;

    let { label } = this.props;

    if (!google || !map) {
      return;
    } else {
      const markerPosition = this.props.newPosition? this.props.newPosition: this.props.position;

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

      this.marker = await new google.maps.Marker(markerOpt);
      this.props.setBounds(markerPosition);

      evtNames.forEach(e => {
        this.marker.addListener(e, this.handleEvent(e));
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
        defaultEventHandler: this.defaultEventHandler,
        google: this.props.google,
        map: this.props.map,
        marker: this.marker,
        selectedMarker: this.props.selectedMarker,
        position: this.props.position,
        title: this.props.title,
        visibleInfoWindow: this.props.visibleInfoWindow,
        contextMenu: this.props.contextMenu,
        infoWindowVisible: this.props.infoWindowVisible,
        clickLatLng: this.props.clickLatLng,
      });
    });
  }

  render() {
    return <div>{this.marker ? this.renderChildren() : <div>Loading marker...</div>}</div>;
  }
}
