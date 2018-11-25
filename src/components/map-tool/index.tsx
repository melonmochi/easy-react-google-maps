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
  contextMenu?: boolean;
  clickLatLng?: google.maps.LatLng | undefined;
}

export default class MapTool extends React.Component<MapToolProps, any> {
  render() {
    return this.props.map ? (
      <div>
        <Card
        style={{ width: 'auto' }}
          actions={[
            <Icon type="setting" key="mapToolsetting" />,
            <Icon type="edit" key="mapTooledit" />,
            <Icon type="ellipsis" key="mapToolellipsis" />,
          ]}
        >
          <div style={{ display:'inline' }}>
            <RecenterButton {...this.props} />
            <FitBoundsButton {...this.props} />
          </div>
        </Card>
      </div>
    ) : null;
  }
}
