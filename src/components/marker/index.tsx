import * as React from 'react';
import { camelCase } from '../utils';

const evtNames = [
  'click',
  'dblclick',
  'dragend',
  'mousedown',
  'mouseout',
  'mouseover',
  'mouseup',
  'recenter',
  'rightclick',
];

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
  [evtNames: string]: any;
}

// tslint:disable-next-line:interface-name
export interface MarkerState {
  newPosition?: { lat: number; lng: number; noWrap?: boolean };
  onSelect: boolean;
  onShowInfo: boolean;
  infoWindowVisible: boolean;
  contextMenu: boolean;
  clickLatLng?: google.maps.LatLng;
}

export default class Marker extends React.Component<MarkerProps, MarkerState> {
  static defaultProps = {
    draggable: true,
    visibleInfoWindow: true,
    withLabel: false,
  };

  marker: google.maps.Marker;

  state = {
    infoWindowVisible: false,
    newPosition: this.props.position,
    onSelect: false,
    onShowInfo: false,
    contextMenu: false,
    clickLatLng: this.props.map? this.props.map.getCenter(): undefined,
  };

  constructor(props: MarkerProps) {
    super(props);

    this.defaultEventHandler = this.defaultEventHandler.bind(this);
  }

  componentDidMount() {
    this.renderMarker();
  }

  handleEvent(evt: string) {
    return (e: google.maps.MouseEvent) => {
      // tslint:disable-next-line:no-console
      console.log('in handleEvent, the e is:', e)
      const evtName = `on${camelCase(evt)}`;
      if (this.props[evtName]) {
        this.props[evtName](this.props, this.marker, e);
      } else {
        this.defaultEventHandler(evtName, e, this.marker);
      }
    };
  }

  defaultEventHandler(evtName: string, e: google.maps.MouseEvent, marker: google.maps.Marker) {
    switch (evtName) {
      case 'onClick':
        this.setState({ onSelect: true, infoWindowVisible: true });
        break;
      case 'onDblclick':
        this.setState({ onSelect: true, infoWindowVisible: false });
        break;
      case 'onRightclick':
        this.setState({ onSelect: true, contextMenu: true, clickLatLng: e.latLng });
        break;
      case 'onCloseinfowindow':
        this.setState({ infoWindowVisible: false });
        break;
      case 'onOpeninfowindow':
        this.setState({ infoWindowVisible: true });
        break;
      case 'onDragend':
        this.props.resetBounds();
        this.setState({
          newPosition: {
            lat: marker.getPosition().lat(),
            lng: marker.getPosition().lng(),
          },
        });
        break;
      default:
      // throw new Error('No corresponding event')
    }
  }

  async renderMarker() {
    const { google, map, title, withLabel, draggable, animation } = this.props;

    let { label } = this.props;

    if (!google || !map) {
      return;
    } else {
      const markerPosition = this.state.newPosition;

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
        infoWindowVisible: this.state.infoWindowVisible,
        map: this.props.map,
        marker: this.marker,
        onSelect: this.state.onSelect,
        onShowInfo: this.state.onShowInfo,
        position: this.props.position,
        title: this.props.title,
        visibleInfoWindow: this.props.visibleInfoWindow,
        contextMenu: this.state.contextMenu,
        clickLatLng: this.state.clickLatLng || undefined,
      });
    });
  }

  render() {
    return <div>{this.marker ? this.renderChildren() : <div>Loading marker...</div>}</div>;
  }
}
