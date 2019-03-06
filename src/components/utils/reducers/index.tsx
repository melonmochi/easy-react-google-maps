import { GlobalContextState as State, Action, Bounds } from 'typings';
import { extendBounds, Stops2Markers } from 'utils';
import { calculateBounds } from '../calculate-bounds';
const MarkerClusterer = require('@google/markerclustererplus');

export const reducers = (state: State, action: Action) => {
  switch (action.type) {
    case 'ADD_GTFS_MARKERS':
      return ADD_GTFS_MARKERS(state, action);
    case 'ADD_MARKER':
      return ADD_MARKER(state, action);
    case 'ADD_MARKERS':
      return ADD_MARKERS(state, action);
    case 'ADD_MARKER_TO_GM_CLUSTER':
      return ADD_MARKER_TO_GM_CLUSTER(state, action);
    case 'ADD_MARKER_TO_OSM_CLUSTER':
      return ADD_MARKER_TO_OSM_CLUSTER(state, action);
    case 'CHANGE_MAP_CARD_WIDTH':
      return CHANGE_MAP_CARD_WIDTH(state, action);
    case 'CHANGE_MAP_PROVIDER':
      return CHANGE_MAP_PROVIDER(state, action);
    case 'CHANGE_MARKER_POSITION':
      return CHANGE_MARKER_POSITION(state, action);
    case 'CHANGE_GTFS':
      return CHANGE_GTFS(state, action);
    case 'END_LOADING':
      return END_LOADING(state, action);
    case 'LOAD_GM_API':
      return LOAD_GM_API(state, action);
    case 'LOAD_MAPS_PROPS':
      return LOAD_MAPS_PROPS(state, action);
    case 'REMOVE_MARKER':
      return REMOVE_MARKER(state, action);
    case 'REMOVE_MARKER_FROM_GM_CLUSTER':
      return REMOVE_MARKER_FROM_GM_CLUSTER(state, action);
    case 'REMOVE_MARKER_FROM_OSM_CLUSTER':
      return REMOVE_MARKER_FROM_OSM_CLUSTER(state, action);
    case 'SELECT_MARKER':
      return SELECT_MARKER(state, action);
    case 'SET_GM_MARKER_CLUSTERER':
      return SET_GM_MARKER_CLUSTERER(state, action);
    case 'SET_MAP_TOOL_STREAM':
      return SET_MAP_TOOL_STREAM(state, action);
    case 'SET_SEARCH_BOX_PLACES_BOUNDS':
      return SET_SEARCH_BOX_PLACES_BOUNDS(state, action);
    case 'SET_VIEW':
      return SET_VIEW(state, action);
    case 'START_LOADING':
      return START_LOADING(state, action);
    case 'UPDATE_BOUNDS':
      return UPDATE_BOUNDS(state, action);
    case 'UPDATE_ICON':
      return UPDATE_ICON(state, action);
    case 'UPDATE_MARKERS_LIST':
      return UPDATE_MARKERS_LIST(state, action);
    case 'UPDATE_VIEW':
      return UPDATE_VIEW(state, action);
    default:
      throw new Error();
  }
};

export const ADD_GTFS_MARKERS = (state: State, action: Action.ADD_GTFS_MARKERS) => {
  const { markersList, markersBounds } = state;
  const baseMarkersList = markersList.filter(m => m.type !== 'gtfs');
  const gtfsMarkersList = Stops2Markers(action.payload);
  const newMarkersList = baseMarkersList.concat(gtfsMarkersList);
  let newBounds = markersBounds;
  if (newMarkersList.length > 0) {
    newBounds = calculateBounds(newMarkersList.map(m => m.props.position)) as Bounds;
  }
  return {
    ...state,
    markersList: newMarkersList,
    markersBounds: newBounds,
    updateBounds: !state.updateBounds,
  } as State;
};
export const ADD_MARKER = (state: State, action: Action.ADD_MARKER) => {
  const { markersBounds } = state;
  const { payload } = action;
  const { type, id, props } = payload;
  const { position } = props;
  const newBounds = markersBounds ? extendBounds(markersBounds, position) : [position, position];
  return {
    ...state,
    markersList: [...state.markersList.concat([{ type, id, props, hide: false }])],
    markersBounds: newBounds,
  } as State;
};
export const ADD_MARKERS = (state: State, action: Action.ADD_MARKERS) => {
  const { markersBounds } = state;
  const initialLatLng = action.payload[0].props.position;
  const initialBounds = markersBounds ? markersBounds : [initialLatLng, initialLatLng];
  const newBounds = action.payload
    .map(m => m.props.position)
    .reduce((bounds: Bounds, p) => extendBounds(bounds, p), initialBounds);
  return {
    ...state,
    markersList: [...state.markersList, ...action.payload],
    markersBounds: newBounds,
  } as State;
};
export const ADD_MARKER_TO_GM_CLUSTER = (state: State, action: Action.ADD_MARKER_TO_GM_CLUSTER) => {
  const GmMarkerClusterer = state.gmMarkerClusterer;
  if (GmMarkerClusterer) {
    GmMarkerClusterer.addMarker(action.payload.marker);
  }
  return state as State;
};
export const ADD_MARKER_TO_OSM_CLUSTER = (
  state: State,
  action: Action.ADD_MARKER_TO_OSM_CLUSTER
) => {
  const mc = state.osmMarkerClusterer;
  mc.addLayer(action.payload);
  return state as State;
};
export const CHANGE_MARKER_POSITION = (state: State, action: Action.CHANGE_MARKER_POSITION) => {
  const { markersList } = state;
  const newMarkersList = markersList.map(m =>
    m.id !== action.payload.id
      ? m
      : {
          ...m,
          props: {
            ...m.props,
            position: action.payload.newPosition,
          },
        }
  );
  const initialLatLng = newMarkersList[0].props.position;
  const initialBounds = [initialLatLng, initialLatLng];
  const newBounds = newMarkersList
    .map(m => m.props.position)
    .reduce((bounds: Bounds, p) => extendBounds(bounds, p), initialBounds);
  return { ...state, markersList: newMarkersList, markersBounds: newBounds } as State;
};
export const CHANGE_MAP_CARD_WIDTH = (state: State, action: Action.CHANGE_MAP_CARD_WIDTH) => {
  return { ...state, mapCardWidth: action.payload } as State;
};
export const CHANGE_MAP_PROVIDER = (state: State, action: Action.CHANGE_MAP_PROVIDER) => {
  return { ...state, mapProvider: action.payload } as State;
};
export const CHANGE_GTFS = (state: State, action: Action.CHANGE_GTFS) => {
  return { ...state, selectedGTFS: action.payload } as State;
};
export const END_LOADING = (state: State, _action: Action.END_LOADING) => {
  return { ...state, loading: false };
};
export const LOAD_GM_API = (state: State, action: Action.LOAD_GM_API) => {
  return { ...state, google: action.payload } as State;
};
export const LOAD_MAPS_PROPS = (state: State, action: Action.LOAD_MAPS_PROPS) => {
  const { center, zoom } = action.payload;
  const propCenter = center ? center : state.mapView.center;
  const propZoom = zoom ? zoom : state.mapView.zoom;
  return {
    ...state,
    center: propCenter,
    mapView: { center: propCenter, zoom: propZoom },
    mapProps: action.payload,
    zoom: propZoom,
  } as State;
};
export const REMOVE_MARKER = (state: State, action: Action.REMOVE_MARKER) => {
  return {
    ...state,
    markersList: state.markersList.filter(m => m.id !== action.payload),
  } as State;
};
export const REMOVE_MARKER_FROM_GM_CLUSTER = (
  state: State,
  action: Action.REMOVE_MARKER_FROM_GM_CLUSTER
) => {
  const GmMarkerClusterer = state.gmMarkerClusterer;
  if (GmMarkerClusterer) {
    GmMarkerClusterer.removeMarker(action.payload.marker);
  }
  return state as State;
};
export const REMOVE_MARKER_FROM_OSM_CLUSTER = (
  state: State,
  action: Action.REMOVE_MARKER_FROM_OSM_CLUSTER
) => {
  const mc = state.osmMarkerClusterer;
  mc.removeLayer(action.payload);
  return state as State;
};
export const SELECT_MARKER = (state: State, action: Action.SELECT_MARKER) => {
  return {
    ...state,
    selectedMarker: state.markersList.find(m => m.id === action.payload),
  } as State;
};
export const SET_GM_MARKER_CLUSTERER = (state: State, action: Action.SET_GM_MARKER_CLUSTERER) => {
  return { ...state, gmMarkerClusterer: new MarkerClusterer(action.payload) } as State;
};
export const SET_MAP_TOOL_STREAM = (state: State, action: Action.SET_MAP_TOOL_STREAM) => {
  return { ...state, mapTools$: Object.assign({}, state.mapTools$, action.payload) } as State;
};
export const SET_SEARCH_BOX_PLACES_BOUNDS = (
  state: State,
  action: Action.SET_SEARCH_BOX_PLACES_BOUNDS
) => {
  return { ...state, searchBoxPlacesBounds: action.payload } as State;
};
export const SET_VIEW = (state: State, action: Action.SET_VIEW) => {
  return {
    ...state,
    mapView: {
      center: action.payload.center ? action.payload.center : state.mapView.center,
      zoom: action.payload.zoom ? action.payload.zoom : state.mapView.zoom,
    },
  } as State;
};
export const START_LOADING = (state: State, _action: Action.START_LOADING) => {
  return { ...state, loading: true };
};
export const UPDATE_BOUNDS = (state: State, _action: Action.UPDATE_BOUNDS) => {
  return { ...state, updateBounds: !state.updateBounds };
};
export const UPDATE_ICON = (state: State, _action: Action.UPDATE_ICON) => {
  return { ...state, updateIcon: !state.updateIcon };
};
export const UPDATE_MARKERS_LIST = (state: State, action: Action.UPDATE_MARKERS_LIST) => {
  return { ...state, markersList: action.payload };
};
export const UPDATE_VIEW = (state: State, _action: Action.UPDATE_VIEW) => {
  return { ...state, updateView: !state.updateView };
};
