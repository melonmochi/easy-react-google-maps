import React, { FunctionComponent, useEffect, useContext, CSSProperties } from 'react';
import { GoogleMapsMap } from 'gm';
import { OSMMap } from 'osm';
import { MapboxMap } from 'mapbox';
import { AllInOneMapProps } from 'typings';
import { GlobalContext } from 'components';
import { Empty } from 'antd';
import { childrenMarkerToObject, googleMapsApiLoader } from 'utils';
import 'components/style';

export const AllInOneMap: FunctionComponent<AllInOneMapProps> = props => {
  const { state, dispatch } = useContext(GlobalContext);
  const { mapProvider, google } = state;

  const loadGmApi = async () => {
    const gmApi = await googleMapsApiLoader(props);
    dispatch({ type: 'LOAD_GM_API', payload: gmApi });
  };

  useEffect(() => {
    if (!state.google) {
      loadGmApi();
    }
    if (Object.keys(state.mapProps).length === 0) {
      dispatch({ type: 'LOAD_MAPS_PROPS', payload: props });
    }
    if (state.markersList.length === 0) {
      const markersToAdd = childrenMarkerToObject(props.children);
      if (markersToAdd && markersToAdd.length > 0) {
        dispatch({ type: 'ADD_MARKERS', payload: markersToAdd });
      }
    }
  }, []);

  const showStyle: CSSProperties = { position: 'absolute', width: '100%', height: '100%' };
  const hideStyle: CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    visibility: 'hidden',
  };

  const gmStyle = mapProvider === 'google' ? showStyle : hideStyle;
  const osmStyle = mapProvider === 'osm' ? showStyle : hideStyle;
  const mapboxStyle = mapProvider === 'mapbox' ? showStyle : hideStyle;

  if (google) {
    return (
      <React.Fragment>
        <div style={gmStyle}>
          <GoogleMapsMap google={google} />
        </div>
        <div style={osmStyle}>
          <OSMMap />
        </div>
        <div style={mapboxStyle}>
          <MapboxMap />
        </div>
      </React.Fragment>
    );
  } else {
    return (
      <Empty
        style={{ margin: 'auto' }}
        description={`No ${state.mapProvider} Api loaded, please check the Internet connection`}
      />
    );
  }
};
