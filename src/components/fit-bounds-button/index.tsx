import * as React from 'react';
import { Button, Tooltip } from 'antd';

// tslint:disable-next-line:interface-name
export interface FitBoundsButtonProps {
  google?: typeof google;
  map?: google.maps.Map;
  bounds?: google.maps.LatLngBounds;
  fitBounds?: any;
}

export default class FitBoundsButton extends React.Component<FitBoundsButtonProps, any> {
  private fbButtonRef = React.createRef<HTMLDivElement>();

  handleClick = () => {
    this.props.fitBounds()
  }

  render() {
    return (
      <div ref={this.fbButtonRef}>
        <Tooltip title="Fit Bounds">
          <Button onClick={this.handleClick} style={{ margin: '12px 12px' }} icon="arrows-alt" />
        </Tooltip>
      </div>
    );
  }
}
