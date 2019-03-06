import React, { FunctionComponent, createContext, useReducer, useEffect } from 'react';
import { GlobalContextInterface, GlobalContextState as State, Stops } from 'typings';
import { reducers, defaultZoom, defaultCenter } from 'utils';
import 'leaflet.markercluster';
import 'assets/styles/MarkerCluster.css';
import 'assets/styles/MarkerCluster.Default.css';

const initialState: State = {
  center: defaultCenter,
  loading: false,
  mapView: { center: defaultCenter, zoom: defaultZoom },
  mapProps: {},
  mapTools$: {},
  markers: { type: 'FeatureCollection', features: [] },
  markerItem$: {},
  markersList: [],
  mapProvider: 'osm',
  osmMarkerClusterer: L.markerClusterGroup(),
  updateBounds: false,
  updateIcon: false,
  updateView: false,
  zoom: defaultZoom,
};

export const GlobalContext = createContext<GlobalContextInterface>({
  state: initialState,
  dispatch: () => {},
});

export const GlobalContextProvider: FunctionComponent = props => {
  const [state, dispatch] = useReducer(reducers, initialState);
  const { selectedGTFS } = state;

  const setStart = async () => dispatch({ type: 'START_LOADING' });
  const loadStops = async (stops: Stops) => dispatch({ type: 'ADD_GTFS_MARKERS', payload: stops });
  const setEnd = async () => dispatch({ type: 'END_LOADING' });
  useEffect(() => {
    if (selectedGTFS) {
      const stops = selectedGTFS.stops;
      if (stops) {
        setStart().then(() => loadStops(stops).then(() => setEnd()));
      }
    }
  }, [selectedGTFS]);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>{props.children}</GlobalContext.Provider>
  );
};
