import * as React from 'react';
import { Card } from 'antd';
import {
  RecenterButton,
} from 'components'

// tslint:disable-next-line:interface-name
export interface MapToolProps {
  google?: typeof google;
  map?: google.maps.Map;
  center?: { lat: number; lng: number; noWrap?: boolean }
  bounds?: google.maps.LatLngBounds;
  setCenter?: any
}

export default class MapTool extends React.Component<MapToolProps, any> {
  render() {
    return this.props.map? (
      <div>
       <Card>
         <RecenterButton {...this.props} />
       </Card>
      </div>
    ):null ;
  }
}
