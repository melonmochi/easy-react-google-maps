import React, { FunctionComponent } from 'react';
import { Layout, Map, Marker } from 'components';

export const EasyMapApp: FunctionComponent = () => {
  return (
    <div className="easyMapApp" style={{ height: '100%' }}>
      <Layout>
        <Map center={[31.233354, 121.475781]}>
          <Marker title="Point A" position={[40.416778, -3.703778]} withLabel draggable />
          <Marker title="Point B" position={[-28.416778, 5.703778]} withLabel draggable />
        </Map>
      </Layout>
    </div>
  );
};

export default EasyMapApp;
