import { GlobalContextState as State, Action, Bounds } from 'typings';
import { extendBounds } from 'utils';

export const reducers = (state: State, action: Action) => {
  switch (action.type) {
    case 'ADD_MARKER':
      return ADD_MARKER(state, action);
    case 'ADD_MARKERS':
      return ADD_MARKERS(state, action);
    case 'CHANGE_MAP_CARD_WIDTH':
      return CHANGE_MAP_CARD_WIDTH(state, action);
    case 'CHANGE_MAP_PROVIDER':
      return CHANGE_MAP_PROVIDER(state, action);
    case 'CHANGE_MARKER_POSITION':
      return CHANGE_MARKER_POSITION(state, action);
    case 'FIT_BOUNDS':
      return FIT_BOUNDS(state, action);
    case 'LOAD_GM_API':
      return LOAD_GM_API(state, action);
    case 'LOAD_MAPS_PROPS':
      return LOAD_MAPS_PROPS(state, action);
    case 'ON_FIT_BOUNDS':
      return ON_FIT_BOUNDS(state, action);
    case 'ON_RECENTER_MAP':
      return ON_RECENTER_MAP(state, action);
    case 'RECENTER_MAP':
      return RECENTER_MAP(state, action);
    case 'REMOVE_MARKER':
      return REMOVE_MARKER(state, action);
    case 'SET_VIEW':
      return SET_VIEW(state, action);
    default:
      throw new Error();
  }
};

export const ADD_MARKER = (state: State, action: Action.ADD_MARKER) => {
  const { markersBounds } = state;
  const { payload } = action;
  const { id, props } = payload;
  const { position } = props;
  const newBounds = markersBounds ? extendBounds(markersBounds, position) : [position, position];
  return {
    ...state,
    markersList: [...state.markersList.concat([{ id, props }])],
    markersBounds: newBounds,
  } as State;
};
export const ADD_MARKERS = (state: State, action: Action.ADD_MARKERS) => {
  const { markersBounds } = state;
  const initialLatLng = action.payload[0].props.position;
  const initialBounds = [initialLatLng, initialLatLng];
  const newBounds = action.payload
    .map(m => m.props.position)
    .reduce(
      (bounds: Bounds, p) => extendBounds(bounds, p),
      markersBounds ? markersBounds : initialBounds
    );
  return {
    ...state,
    markersList: [...state.markersList, ...action.payload],
    markersBounds: newBounds,
  } as State;
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
export const FIT_BOUNDS = (state: State, _action: Action.FIT_BOUNDS) => {
  return { ...state, fitBounds: true };
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
    mapView: { center: propCenter, zoom: propZoom },
    mapProps: action.payload,
  } as State;
};
export const ON_FIT_BOUNDS = (state: State, _action: Action.ON_FIT_BOUNDS) => {
  return { ...state, fitBounds: false };
};
export const ON_RECENTER_MAP = (state: State, _action: Action.ON_RECENTER_MAP) => {
  return { ...state, recenterMap: false };
};
export const RECENTER_MAP = (state: State, _action: Action.RECENTER_MAP) => {
  return { ...state, recenterMap: true };
};
export const REMOVE_MARKER = (state: State, action: Action.REMOVE_MARKER) => {
  return {
    ...state,
    markersList: state.markersList.filter(m => m.id !== action.payload),
  } as State;
};
export const SET_VIEW = (state: State, action: Action.SET_VIEW) => {
  return { ...state, mapView: action.payload } as State;
};
