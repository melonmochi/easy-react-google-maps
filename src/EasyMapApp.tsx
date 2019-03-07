import React, { FunctionComponent } from 'react';
import { Layout, Map } from 'components';
import { city, randomLatLng } from 'utils';

export const EasyMapApp: FunctionComponent = () => {
  return (
    <div className="easyMapApp" style={{ height: '100%' }}>
      <Layout>
        <Map center={city.London} zoom={11} mapsToShow="leaflet" />
      </Layout>
    </div>
  );
};

const emptyArr = (n: number) => Array.from(new Array(n));

export const Markers = (n: number) =>
  emptyArr(n).map((_x, i) => ({
    title: i.toString(),
    position: randomLatLng(),
    draggable: true,
  }));

export default EasyMapApp;
