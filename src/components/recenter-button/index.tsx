import * as React from 'react';
import { Button, Tooltip } from 'antd';
import { GoogleMapsControlPosition } from '../search-box';

// tslint:disable-next-line:interface-name
export interface RecenterButtonProps {
  google?: typeof google;
  map?: google.maps.Map;
  center?: { lat: number; lng: number; noWrap?: boolean };
  position?: GoogleMapsControlPosition;
}

export default class RecenterButton extends React.Component<RecenterButtonProps, any> {
  private rcButtonRef = React.createRef<HTMLDivElement>();

  componentDidMount() {
    this.renderRecenterButton();
  }

  recenterControl(controlDiv: HTMLDivElement) {
    const { map, center } = this.props;
    if (map && center) {
      const controlUI = document.createElement('div');
      controlUI.appendChild(controlDiv);
      controlUI.addEventListener('click', () => map.setCenter(center));
      return controlUI;
    } else {
      return;
    }
  }

  renderRecenterButton() {
    const { map } = this.props;
    const rcButton = this.rcButtonRef.current;
    const rcControl = this.recenterControl(rcButton as HTMLDivElement);
    if (map && rcControl) {
      const position = this.props.position ? this.props.position : 'RIGHT_TOP';
      map.controls[google.maps.ControlPosition[position]].push(rcControl);
    }
  }

  render() {
    return (
      <div ref={this.rcButtonRef}>
        <Tooltip title="Recenter Map">
          <Button style={{ margin: '12px 12px' }} icon="undo" />
        </Tooltip>
      </div>
    );
  }
}
