import React, { FunctionComponent, useEffect, useContext, useState } from 'react';
import { GoogleMapsMap } from 'gm';
import { OSMMap } from 'osm';
import { MapboxMap } from 'mapbox';
import { AllInOneMapProps } from 'typings';
import { GlobalContext } from 'components';
import { Empty } from 'antd';
import { googleMapsApiLoader } from 'utils';
import { mapboxConfig } from 'config';
import uuidv4 from 'uuid';
import 'components/style';

const mapsList = {
  none: { google: false, osm: false, mapbox: false },
  google: { google: true, osm: false, mapbox: false },
  leaflet: { google: false, osm: true, mapbox: false },
  mapbox: { google: false, osm: false, mapbox: true },
  all: { google: true, osm: true, mapbox: true },
};

export const AllInOneMap: FunctionComponent<AllInOneMapProps> = props => {
  const { mapsToShow, markers, mapboxToken } = props;
  const { state, dispatch } = useContext(GlobalContext);
  const { google } = state;
  const mbToken = mapboxToken ? mapboxToken : mapboxConfig.token;

  const [maps, setMaps] = useState<{ google: Boolean; osm: Boolean; mapbox: Boolean }>({
    google: true,
    osm: true,
    mapbox: true,
  });

  const loadGmApi = async () => {
    const gmApi = await googleMapsApiLoader(props);
    dispatch({ type: 'LOAD_GM_API', payload: gmApi });
  };

  useEffect(() => {
    if (mapsToShow) {
      setMaps(mapsList[mapsToShow]);
    }
    if (!state.google) {
      loadGmApi();
    }
    if (Object.keys(state.mapProps).length === 0) {
      dispatch({ type: 'LOAD_MAPS_PROPS', payload: props });
    }
    if (markers && markers.length > 0) {
      dispatch({
        type: 'ADD_MARKERS',
        payload: markers.map(m => ({ id: uuidv4(), props: m, hide: false })),
      });
    }
  }, []);

  const EmptyElement = (provider: string) => (
    <Empty
      style={{ margin: 'auto' }}
      description={`No ${provider} Api loaded, please check the Internet connection and Api token's validation`}
    />
  );

  return (
    <React.Fragment>
      {google && maps.google ? <GoogleMapsMap google={google} /> : EmptyElement(state.mapProvider)}
      {maps.osm ? <OSMMap /> : EmptyElement(state.mapProvider)}
      {maps.mapbox && mbToken && mbToken !== '' ? (
        <MapboxMap token={mbToken} />
      ) : (
        EmptyElement(state.mapProvider)
      )}
    </React.Fragment>
  );
};
