import {
  GlobalContextState as State,
  Action,
} from 'typings';
import {
  extendBounds
} from 'utils'
import mapboxgl from 'mapbox-gl';

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
    case 'CHANGE_MAP_CARD_WIDTH':
      return CHANGE_MAP_CARD_WIDTH(state, action)
    case 'CHANGE_MAP_PROVIDER':
      return CHANGE_MAP_PROVIDER(state, action)
    case 'CHANGE_ZOOM':
      return CHANGE_ZOOM(state, action)
    case 'LOAD_GM_API':
      return LOAD_GM_API(state, action)
    case 'LOAD_MAPS_PROPS':
      return LOAD_MAPS_PROPS(state, action)
    case 'REMOVE_MARKER':
      return REMOVE_MARKER(state, action)
    case 'RECENTER_MAP':
      return RECENTER_MAP(state, action)
    case 'FIT_BOUNDS':
      return FIT_BOUNDS(state, action)
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
  return {
    ...state,
    markersList: [...state.markersList, ...action.payload],
  } as State
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

export const LOAD_GM_API = (state: State, action: Action.LOAD_GM_API) => {
  return { ...state, google: action.payload } as State
}

export const LOAD_MAPS_PROPS = (state: State, action: Action.LOAD_MAPS_PROPS) => {
  return { ...state, mapProps: action.payload } as State
}

export const REMOVE_MARKER = (state: State, action: Action.REMOVE_MARKER) => {
  return {
    ...state,
    markersList: state.markersList
      .filter(m => m.id !== action.payload),
  } as State
}

export const RECENTER_MAP = (state: State, _action: Action.RECENTER_MAP) => {
  return { ...state, currentCenter: state.center } as State
}

export const FIT_BOUNDS = (state: State, _action: Action.FIT_BOUNDS) => {
  switch (state.mapProvider) {
    case 'google':
      if (state.google && state.gmMap && state.markersList.length > 0) {
        const bounds = setGmBounds(state.google, state.markersList)
        state.gmMap.fitBounds(bounds)
      }
      break;
    case 'osm':
      if (state.osmMap && state.markersList.length > 0) {
        state.osmMap.fitBounds(setOSMBounds(state.markersList), { padding: [93, 93] })
      }
      break;
    case 'mapbox':
      if (state.mapboxMap && state.markersList.length > 0) {
        state.mapboxMap.fitBounds(setMapboxBounds(state.markersList), { padding: 93, linear: true })
      }
      break
    default:
      break;
  }
  return state as State
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

// TEMP USE, WILL BE REFACT IN SOON
const setGmBounds = (g: typeof google, markersArray: State['markersList']) => {
  const emptyBounds = new g.maps.LatLngBounds();
  markersArray.forEach(m => {
    const latlng = new g.maps.LatLng(m.props.position[0], m.props.position[1])
    emptyBounds.extend(latlng);
  })
  return emptyBounds
};

const setOSMBounds = (markersArray: State['markersList']) => {
  return markersArray.map(m => m.props.position)
};

const setMapboxBounds = (markersArray: State['markersList']) => {
  const emptyBounds = new mapboxgl.LngLatBounds();
  markersArray.forEach(m => emptyBounds.extend(new mapboxgl.LngLat(m.props.position[1], m.props.position[0])))
  return emptyBounds
};
