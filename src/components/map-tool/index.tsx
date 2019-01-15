import * as React from 'react';
import { Card } from 'antd';
import { RecenterButton, FitBoundsButton } from 'components';

// tslint:disable-next-line:interface-name
export interface MapToolProps {
  map?: google.maps.Map;
  setCenter: () => void;
  fitBounds: () => void;
}

export default class MapTool extends React.Component<MapToolProps, any> {
  render() {
    return this.props.map ? (
      <Card style={{ width: 'auto' }} bordered={false}>
        <RecenterButton {...this.props} />
        <FitBoundsButton {...this.props} />
      </Card>
    ) : null;
  }
}
