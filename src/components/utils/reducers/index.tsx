import {
  GlobalContextState as State,
  Action,
} from 'typings';
import { extendBounds, boundsToGmbounds } from 'utils';

export const reducers = (state: State, action: Action) => {
  switch (action.type) {
    case 'ADD_MARKER':
      return ADD_MARKER(state, action)
    case 'ADD_MARKERS':
      return ADD_MARKERS(state, action)
    case 'CHANGE_MARKER_POSITION':
      return CHANGE_MARKER_POSITION(state, action)
    case 'CHANGE_CURRENT_CENTER':
      return CHANGE_CURRENT_CENTER(state, action)
    case 'CHANGE_GM_BOUNDS':
      return CHANGE_GM_BOUNDS(state, action)
    case 'CHANGE_MAP_CARD_WIDTH':
      return CHANGE_MAP_CARD_WIDTH(state, action)
    case 'CHANGE_MAP_PROVIDER':
      return CHANGE_MAP_PROVIDER(state, action)
    case 'CHANGE_ZOOM':
      return CHANGE_ZOOM(state, action)
    case 'FIT_BOUNDS':
      return FIT_BOUNDS(state, action)
    case 'LOAD_GM_API':
      return LOAD_GM_API(state, action)
    case 'LOAD_MAPS_PROPS':
      return LOAD_MAPS_PROPS(state, action)
    case 'ON_FIT_BOUNDS':
      return ON_FIT_BOUNDS(state, action)
    case 'ON_RECENTER_MAP':
      return ON_RECENTER_MAP(state, action)
    case 'RECENTER_MAP':
      return RECENTER_MAP(state, action)
    case 'REMOVE_MARKER':
      return REMOVE_MARKER(state, action)
    case 'RESIZE_MAPBOX_MAP':
      return RESIZE_MAPBOX_MAP(state, action)
    case 'RESIZE_OSM_MAP':
      return RESIZE_OSM_MAP(state, action)
    case 'SET_DEFAULT_CENTER':
      return SET_DEFAULT_CENTER(state, action)
    case 'SET_DEFAULT_ZOOM':
      return SET_DEFAULT_ZOOM(state, action)
    case 'SET_GM_MAP':
      return SET_GM_MAP(state, action)
    case 'SET_MAPBOX_MAP':
      return SET_MAPBOX_MAP(state, action)
    case 'SET_OSM_MAP':
      return SET_OSM_MAP(state, action)
    default:
      throw new Error();
  }
}

export const ADD_MARKER = (state: State, action: Action.ADD_MARKER) => {
  const { bounds } = state
  const { payload } = action
  const { id, props } = payload
  const { position } = props
  const newBounds = extendBounds(bounds, position)
  return {
    ...state,
    markersList: [...state.markersList.concat([{ id, props }])],
    bounds: newBounds,
  } as State
}
export const ADD_MARKERS = (state: State, action: Action.ADD_MARKERS) => {
  const newBounds = action.payload
    .map( m => m.props.position)
    .reduce( (bounds, p) => extendBounds(bounds, p), state.bounds)
  return {
    ...state,
    markersList: [...state.markersList, ...action.payload],
    bounds: newBounds,
  } as State
}

export const CHANGE_GM_BOUNDS = (state: State, action: Action.CHANGE_GM_BOUNDS) => {
  return { ...state, gmBounds: action.payload } as State
}

export const CHANGE_MARKER_POSITION = (state: State, action: Action.CHANGE_MARKER_POSITION) => {
  const { markersList } = state
  const newMarkersList = markersList.map(m => m.id !== action.payload.id ? m : {
    ...m, props: {
      ...m.props, position: action.payload.newPosition,
    },
  });
  return { ...state, markersList: newMarkersList } as State
}

export const CHANGE_CURRENT_CENTER = (state: State, action: Action.CHANGE_CURRENT_CENTER) => {
  return { ...state, currentCenter: action.payload } as State
}

export const CHANGE_MAP_CARD_WIDTH = (state: State, action: Action.CHANGE_MAP_CARD_WIDTH) => {
  return { ...state, mapCardWidth: action.payload } as State
}

export const CHANGE_MAP_PROVIDER = (state: State, action: Action.CHANGE_MAP_PROVIDER) => {
  return { ...state, mapProvider: action.payload } as State
}
export const CHANGE_ZOOM = (state: State, action: Action.CHANGE_ZOOM) => {
  return { ...state, zoom: action.payload } as State
}
export const FIT_BOUNDS = (state: State, _action: Action.FIT_BOUNDS) => {
  const { bounds, gmMap, osmMap, mapboxMap } = state
  const gBounds = boundsToGmbounds(bounds)
  if(gmMap) {
    gmMap.fitBounds(gBounds)
  }
  if(osmMap) {
    osmMap.fitBounds(bounds)
  }
  if(mapboxMap) {
    mapboxMap.fitBounds(bounds, {padding: 93})
  }
  return state as State
}

export const LOAD_GM_API = (state: State, action: Action.LOAD_GM_API) => {
  return { ...state, google: action.payload } as State
}

export const LOAD_MAPS_PROPS = (state: State, action: Action.LOAD_MAPS_PROPS) => {
  return { ...state, mapProps: action.payload } as State
}
export const ON_FIT_BOUNDS = (state: State, _action: Action.ON_FIT_BOUNDS) => {
  return { ...state, fitBounds: false } as State
}
export const ON_RECENTER_MAP = (state: State, _action: Action.ON_RECENTER_MAP) => {
  return { ...state, recenterMap: false } as State
}
export const RECENTER_MAP = (state: State, _action: Action.RECENTER_MAP) => {
  const { center, gmMap, osmMap, mapboxMap } = state
  const gCenter = new google.maps.LatLng(center[0], center[1])
  if(gmMap) {
    gmMap.panTo(gCenter)
  }
  if(osmMap) {
    osmMap.panTo(center)
  }
  if(mapboxMap) {
    mapboxMap.panTo([center[1], center[0]])
  }
  return state as State
}
export const REMOVE_MARKER = (state: State, action: Action.REMOVE_MARKER) => {
  return {
    ...state,
    markersList: state.markersList
      .filter(m => m.id !== action.payload),
  } as State
}
export const RESIZE_MAPBOX_MAP = (state: State, _action: Action.RESIZE_MAPBOX_MAP) => {
  const { mapboxMap } = state
  if(mapboxMap) {
    mapboxMap.resize()
  }
  return {...state} as State
}
export const RESIZE_OSM_MAP = (state: State, _action: Action.RESIZE_OSM_MAP) => {
  const { osmMap } = state
  if(osmMap) {
    osmMap.invalidateSize()
  }
  return {...state} as State
}
export const SET_DEFAULT_CENTER = (state: State, action: Action.SET_DEFAULT_CENTER) => {
  return { ...state, center: action.payload } as State
}

export const SET_DEFAULT_ZOOM = (state: State, action: Action.SET_DEFAULT_ZOOM) => {
  return { ...state, zoom: action.payload } as State
}

export const SET_GM_MAP = (state: State, action: Action.SET_GM_MAP) => {
  return { ...state, gmMap: action.payload } as State
}
export const SET_MAPBOX_MAP = (state: State, action: Action.SET_MAPBOX_MAP) => {
  return { ...state, mapboxMap: action.payload } as State
}
export const SET_OSM_MAP = (state: State, action: Action.SET_OSM_MAP) => {
  return { ...state, osmMap: action.payload } as State
}
