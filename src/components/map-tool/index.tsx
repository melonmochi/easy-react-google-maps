import * as React from 'react';
import { Card, Icon } from 'antd';
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
}

export default class MapTool extends React.Component<MapToolProps, any> {
  render() {
    return this.props.map ? (
      <div>
        <Card
          actions={[
            <Icon type="setting" key="mapToolsetting" />,
            <Icon type="edit" key="mapTooledit" />,
            <Icon type="ellipsis" key="mapToolellipsis" />,
          ]}
        >
          <RecenterButton {...this.props} />
          <FitBoundsButton {...this.props} />
        </Card>
      </div>
    ) : null;
  }
}
