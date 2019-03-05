import React, { FunctionComponent, createContext, useReducer } from 'react';
import { GlobalContextInterface, GlobalContextState as State } from 'typings';
import { reducers, defaultZoom, defaultCenter } from 'utils';
import 'leaflet.markercluster';
import 'assets/styles/MarkerCluster.css';
import 'assets/styles/MarkerCluster.Default.css';

const initialState: State = {
  center: defaultCenter,
  mapView: { center: defaultCenter, zoom: defaultZoom },
  mapProps: {},
  mapTools$: {},
  markers: { type: 'FeatureCollection', features: [] },
  markerItem$: {},
  markersList: [],
  mapProvider: 'osm',
  osmMarkerClusterer: L.markerClusterGroup(),
  updateIcon: false,
  zoom: defaultZoom,
};

export const GlobalContext = createContext<GlobalContextInterface>({
  state: initialState,
  dispatch: () => {},
});

export const GlobalContextProvider: FunctionComponent = props => {
  const [state, dispatch] = useReducer(reducers, initialState);
  return (
    <GlobalContext.Provider value={{ state, dispatch }}>{props.children}</GlobalContext.Provider>
  );
};
