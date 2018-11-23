import * as React from 'react';
import { Button, Tooltip } from 'antd';

// tslint:disable-next-line:interface-name
export interface RecenterButtonProps {
  google?: typeof google;
  map?: google.maps.Map;
  center?: { lat: number; lng: number; noWrap?: boolean };
  bounds?: google.maps.LatLngBounds;
  setCenter?: any;
}

export default class RecenterButton extends React.Component<RecenterButtonProps, any> {

  handleClick = () => {
    this.props.setCenter()
  }

  render() {
    return (
      <Tooltip title="Recenter Map">
        <Button onClick={this.handleClick} style={{ margin: '12px 12px' }} icon="undo" />
      </Tooltip>
    );
  }
}
