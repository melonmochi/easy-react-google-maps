import * as React from 'react';
import {
  GoogleMapsApiLoader,
  MapLayout,
  Map,
  Marker,
  SearchBox,
  InfoWindow,
  MarkerContextMenu,
} from './components';
import { config } from 'config';
// const mapStyles = require('./mapStyles.less')

export class MapContainer extends React.Component {
  render() {
    return (
      <div>
        <MapLayout
        >
         <Map
          type="roadmap"
          gestureHandling="greedy"
          zoom={14}
          initialCenter={{ lat: 31.112112, lng: 121.366114 }}
          // mapStyle={mapStyles}
          {...this.props}
         >
          <Marker
            title="Point A"
            position={{ lat: 37.773972, lng: -122.431297 }}
            withLabel
            label="C"
            animation="DROP"
            {...this.props}
          >
            <InfoWindow />
            <MarkerContextMenu />
          </Marker>
          <Marker
            title="Point B"
            position={{ lat: 35.773972, lng: -129.431297 }}
            withLabel
            label="J"
            animation="DROP"
          >
            <InfoWindow />
          </Marker>
          <SearchBox position="TOP_LEFT" />
          </Map>
        </MapLayout>
      </div>
    );
  }
}

export default GoogleMapsApiLoader({
  apiKey: config.apiKey,
  language: 'en',
  region: 'US',
})(MapContainer);
