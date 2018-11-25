import * as React from 'react';

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
  cmOverlayView?: google.maps.OverlayView
  containerElement?: HTMLDivElement
}

export default class MarkerContextMenu extends React.Component<MarkerContextMenuProps, MarkerContextMenuState> {

  containerElement: HTMLDivElement;

  private contextMenuRef = React.createRef<HTMLDivElement>();

  constructor(props: MarkerContextMenuProps) {
    super(props)
    const { map } = this.props
    const cmOverlay = new google.maps.OverlayView()
    cmOverlay.onAdd = this.onAdd.bind(this)
    cmOverlay.draw = this.draw.bind(this)
    cmOverlay.onRemove = this.onRemove.bind(this)
    if(map) {
      cmOverlay.setMap(map)
    }
    this.state = {
      cmOverlayView: cmOverlay,
    }
  }

  componentDidUpdate() {
    this.renderContextMenu()
  }

  shouldComponentUpdate(nextProps: MarkerContextMenuProps) {
    return nextProps.contextMenu !== this.props.contextMenu
  }

  renderContextMenu = () => {
    const { map, contextMenu } = this.props
    const { cmOverlayView } = this.state
    if(contextMenu === true && cmOverlayView && map) {
      cmOverlayView.onAdd()
    }
    if(contextMenu === false && cmOverlayView && map) {
      cmOverlayView.onRemove()
    }
  }

    onAdd = () => {
      const { contextMenu } = this.props
      const { cmOverlayView } = this.state
      this.containerElement = document.createElement('div');
      this.containerElement.style.position = 'absolute'
      const cmComponent = this.contextMenuRef.current;
      this.containerElement.appendChild(cmComponent as HTMLDivElement)
      if(cmOverlayView && contextMenu === true){
        cmOverlayView.getPanes().floatPane.appendChild(this.containerElement)
      }
    };

    onRemove = () => {
      const { contextMenu } = this.props
      if (this.containerElement.parentElement && contextMenu === false) {
        this.containerElement.parentElement.removeChild(this.containerElement);
      }
    }

    draw() {
      const { containerElement } = this
      const { cmOverlayView } = this.state
      const { clickLatLng } = this.props
      if(cmOverlayView && containerElement && clickLatLng) {
        const divPosition = cmOverlayView.getProjection().fromLatLngToDivPixel(clickLatLng)
        // tslint:disable-next-line:no-console
        console.log('clicklatlon and divposition are', clickLatLng.lat(), divPosition)
        if(divPosition) {
          const display =
        Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000 ?
        'block' :
        'none';
        if (display === 'block') {
          containerElement.style.left = divPosition.x + 'px';
          containerElement.style.top = divPosition.y + 'px';
        }
        if (containerElement.style.display !== display) {
          containerElement.style.display = display;
        }
      }}
    }

  render() {
    return (<div ref={this.contextMenuRef}>
    I'm layout
  </div>)
  }
}
