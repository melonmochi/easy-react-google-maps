import * as React from 'react';
import { Menu } from 'antd'

// tslint:disable-next-line:interface-name
export interface MarkerContextMenuProps {
  google?: typeof google;
  map?: google.maps.Map;
  marker?: google.maps.Marker;
  title?: string;
  position?: { lat: number; lng: number };
  contextMenu?: boolean;
  defaultEventHandler?: any;
  clickLatLng?: google.maps.LatLng | undefined;
}

// tslint:disable-next-line:interface-name
export interface MarkerContextMenuState {
  onOpenContextMenu: boolean;
}

export default class MarkerContextMenu extends React.Component<MarkerContextMenuProps, MarkerContextMenuState> {
  static defaultProps = {
    infoWindowVisible: false,
    visibleInfoWindows: true,
  };

  state = {
    onOpenContextMenu: false,
  };
  cmOverlay: google.maps.OverlayView;

  cmAnchor: HTMLDivElement;

  private contextMenuRef = React.createRef<HTMLDivElement>();

  componentDidMount() {
    // tslint:disable-next-line:no-console
    console.log('im in componentDidDount, this.props is', this.props)
    if(this.props.marker) {
      this.renderContextMenu();
    }
  }

  renderContextMenu = () => {
    const { map, marker, contextMenu, clickLatLng } = this.props
    // tslint:disable-next-line:no-console
    console.log('im in renderContextMenu, this.props is', this.props)
    const cmComponent = this.contextMenuRef.current;
    this.cmAnchor = document.createElement('div');
    this.cmAnchor.appendChild(cmComponent as HTMLDivElement);
    if( !map || !marker || !clickLatLng ) {
      throw new Error('It could not be opened by lack of params')
    }
    else {
      this.cmOverlay = new google.maps.OverlayView()
      this.cmOverlay.setMap(map);
      this.cmOverlay.onAdd = this.onOpenContextMenu
      this.cmOverlay.onRemove = this.onCloseContextmenu
      this.cmOverlay.draw = this.drawContextMenu
      if(contextMenu){
        this.onOpenContextMenu()
      } else {
      }
    }
  }

    onOpenContextMenu = () => {
      this.cmOverlay.getPanes().floatPane.appendChild(this.cmAnchor)
    };

    onCloseContextmenu = () => {
      if (this.cmAnchor.parentElement) {
        this.cmAnchor.parentElement.removeChild(this.cmAnchor);
      }
    }

    drawContextMenu() {
      const { clickLatLng } = this.props
      if(clickLatLng) {
        const divPosition = this.cmOverlay.getProjection().fromLatLngToDivPixel(clickLatLng);
        const display =
        Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000 ?
        'block' :
        'none';
        if (display === 'block') {
          this.cmAnchor.style.left = divPosition.x + 'px';
          this.cmAnchor.style.top = divPosition.y + 'px';
        }
        if (this.cmAnchor.style.display !== display) {
          this.cmAnchor.style.display = display;
        }
      }
    }

  render() {
    return (
      <div ref={this.contextMenuRef}>
        <Menu />
      </div>
    )
  }
}
