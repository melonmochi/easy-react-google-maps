import React, { FunctionComponent } from 'react';
import { Layout, Map, Marker } from 'components';
import { city, randomLatLng } from 'utils';

export const EasyMapApp: FunctionComponent = () => {
  console.log(Markers(100))
  return (
    <div className="easyMapApp" style={{ height: '100%' }}>
      <Layout>
        <Map center={city.London} zoom={11}>
          {Markers(10)}
        </Map>
      </Layout>
    </div>
  );
};

const emptyArr = ( n: number ) => Array.from(new Array(n))

const Markers = (n: number) => emptyArr(n).map((_x, i) => (
  <Marker
    key={i}
    title={i.toString()}
    position={randomLatLng()}
    withLabel
    draggable
  />
))

export default EasyMapApp;
