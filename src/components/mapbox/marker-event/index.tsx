import { GlobalContextDispatch, MarkerEvtHandlersType } from 'typings';
import { camelCase } from 'utils';

type defaultMarkerEvtHndsType = {
  map: mapboxgl.Map;
  evtName: string;
  id: string;
  marker: mapboxgl.Marker;
  ifselected: boolean;
  dispatch: GlobalContextDispatch;
  setMarkerStyle: React.Dispatch<
    React.SetStateAction<'greenMarker' | 'blueBigMarker' | 'redBigMarker'>
  >;
};

type handleMarkerEvtType = {
  map: mapboxgl.Map;
  evt: string;
  id: string;
  marker: mapboxgl.Marker;
  ifselected: boolean;
  dispatch: GlobalContextDispatch;
  setMarkerStyle: React.Dispatch<
    React.SetStateAction<'greenMarker' | 'blueBigMarker' | 'redBigMarker'>
  >;
  markerEvtHandlers?: MarkerEvtHandlersType | any;
};

export const defaultMarkerEvtHnds = (input: defaultMarkerEvtHndsType) => {
  const { map, evtName, id, marker, ifselected, dispatch, setMarkerStyle } = input;
  switch (evtName) {
    case 'onClick':
      dispatch({
        type: 'SELECT_MARKER',
        payload: id,
      });
      break;
    case 'onDblclick':
      map.panTo(marker.getLngLat());
      break;
    case 'onDragend':
      dispatch({
        type: 'CHANGE_MARKER_POSITION',
        payload: {
          id: id,
          newPosition: [marker.getLngLat().lat, marker.getLngLat().lng],
        },
      });
      break;
    case 'onMouseover':
      return !ifselected && setMarkerStyle('blueBigMarker');
    case 'onMouseout':
      return !ifselected && setMarkerStyle('greenMarker');
    default:
    // throw new Error('No corresponding event')
  }
};

export const handleMarkerEvt = (input: handleMarkerEvtType) => {
  const { map, evt, id, marker, ifselected, dispatch, setMarkerStyle, markerEvtHandlers } = input;
  const evtName = `on${camelCase(evt)}`;
  if (markerEvtHandlers) {
    const customMarkerEvtHnd = markerEvtHandlers[evtName];
    if (customMarkerEvtHnd) {
      customMarkerEvtHnd(marker);
    } else {
      defaultMarkerEvtHnds({ map, evtName, id, marker, ifselected, dispatch, setMarkerStyle });
    }
  } else {
    defaultMarkerEvtHnds({ map, evtName, id, marker, ifselected, dispatch, setMarkerStyle });
  }
};
