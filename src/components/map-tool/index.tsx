import * as React from 'react';
import { Card } from 'antd';
import {
  RecenterButton,
  FitBoundsButton,
} from 'components'

// tslint:disable-next-line:interface-name
export interface MapToolProps {
  google?: typeof google
  map?: google.maps.Map;
  center?: { lat: number; lng: number; noWrap?: boolean }
  bounds?: google.maps.LatLngBounds;
  setCenter?: any;
  fitBounds?: any;
  contextMenu?: boolean;
  clickLatLng?: google.maps.LatLng | undefined;
}

export default class MapTool extends React.Component<MapToolProps, any> {
  render() {
    return this.props.map ? (
      <Card
        style={{ width: 'auto' }}
        bordered={false}
      >
        <RecenterButton {...this.props} />
        <FitBoundsButton {...this.props} />
      </Card>
    ) : null;
  }
}
