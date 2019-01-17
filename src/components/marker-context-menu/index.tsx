import * as React from 'react';
import { Icon } from 'antd';
import './style';

// tslint:disable-next-line:interface-name
export interface MarkerContextMenuProps {
  google?: typeof google;
  map?: google.maps.Map;
  marker?: google.maps.Marker;
  title?: string;
  position?: { lat: number; lng: number };
  defaultEventHandler?: any;
  selectedMarker?: google.maps.Marker;
  contextMenuVisible?: boolean;
  clickLatLng?: google.maps.LatLng | undefined;
}

// tslint:disable-next-line:interface-name
export interface MarkerContextMenuState {
  cmOverlayView?: google.maps.OverlayView;
  containerElement?: HTMLDivElement;
}

export default class MarkerContextMenu extends React.Component<
  MarkerContextMenuProps,
  MarkerContextMenuState
> {
  containerElement: HTMLDivElement;

  private contextMenuRef = React.createRef<HTMLDivElement>();

  constructor(props: MarkerContextMenuProps) {
    super(props);
    const { map } = this.props;
    const cmOverlay = new google.maps.OverlayView();
    cmOverlay.onAdd = this.onAdd.bind(this);
    cmOverlay.draw = this.draw.bind(this);
    cmOverlay.onRemove = this.onRemove.bind(this);
    if (map) {
      cmOverlay.setMap(map);
    }
    this.state = {
      cmOverlayView: cmOverlay,
    };
  }

  componentDidUpdate() {
    this.renderContextMenu();
  }

  shouldComponentUpdate(nextProps: MarkerContextMenuProps) {
    return (
      nextProps.contextMenuVisible !== this.props.contextMenuVisible ||
      nextProps.selectedMarker !== this.props.selectedMarker ||
      nextProps.clickLatLng !== this.props.clickLatLng
    );
  }

  renderContextMenu = () => {
    const { contextMenuVisible: contextMenu, clickLatLng, selectedMarker } = this.props;
    const { cmOverlayView } = this.state;
    if (cmOverlayView) {
      cmOverlayView.draw();
      if (selectedMarker === this.props.marker && clickLatLng && contextMenu) {
        cmOverlayView.getPanes().floatPane.appendChild(this.containerElement);
      } else {
        cmOverlayView.onRemove();
      }
    }
  };

  onAdd = () => {
    this.containerElement = document.createElement('div');
    this.containerElement.style.position = 'absolute';
    const cmComponent = this.contextMenuRef.current;
    this.containerElement.appendChild(cmComponent as HTMLDivElement);
  };

  onRemove = () => {
    if (this.containerElement.parentElement) {
      this.containerElement.parentElement.removeChild(this.containerElement);
    }
  };

  draw() {
    const { containerElement } = this;
    const { cmOverlayView } = this.state;
    const { clickLatLng } = this.props;
    if (cmOverlayView && containerElement && clickLatLng) {
      const divPosition = cmOverlayView.getProjection().fromLatLngToDivPixel(clickLatLng);
      if (divPosition) {
        const display =
          Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000 ? 'block' : 'none';
        if (display === 'block') {
          containerElement.style.left = divPosition.x + 'px';
          containerElement.style.top = divPosition.y + 'px';
        }
        if (containerElement.style.display !== display) {
          containerElement.style.display = display;
        }
      }
    }
  }

  render() {
    return (
      <div ref={this.contextMenuRef}>
        {this.props.contextMenuVisible ? (
          <ul className="popup">
            <li>
              <Icon type="user" />
              Name
            </li>
            <li>
              <Icon type="heart-o" />
              Like it
            </li>
            <li>
              <Icon type="star-o" />
              Bookmark
            </li>
          </ul>
        ) : null}
      </div>
    );
  }
}
