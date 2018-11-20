import * as React from 'react';
import { Button, Tooltip } from 'antd';
import { GoogleMapsControlPosition } from '../search-box';

// tslint:disable-next-line:interface-name
export interface FitBoundsButtonProps {
  google?: typeof google;
  map?: google.maps.Map;
  bounds?: google.maps.LatLngBounds;
  position?: GoogleMapsControlPosition;
}

export default class FitBoundsButton extends React.Component<FitBoundsButtonProps, any> {
  private fbButtonRef = React.createRef<HTMLDivElement>();

  componentDidMount() {
    this.renderFitBoundsButton();
  }

  fitBoundsControl(controlDiv: HTMLDivElement) {
    const { map, bounds } = this.props;
    if (map && bounds) {
      const controlUI = document.createElement('div');
      controlUI.appendChild(controlDiv);
      controlUI.addEventListener('click', () => map.fitBounds(bounds));
      return controlUI;
    } else {
      return;
    }
  }

  renderFitBoundsButton() {
    const { map } = this.props;
    const fbButton = this.fbButtonRef.current;
    const fbControl = this.fitBoundsControl(fbButton as HTMLDivElement);
    const position = this.props.position ? this.props.position : 'RIGHT_TOP';
    if (map && fbControl) {
      map.controls[google.maps.ControlPosition[position]].push(fbControl);
    }
  }

  render() {
    return (
      <div ref={this.fbButtonRef}>
        <Tooltip title="Fit Bounds">
          <Button style={{ margin: '12px 12px' }} icon="arrows-alt" />
        </Tooltip>
      </div>
    );
  }
}
