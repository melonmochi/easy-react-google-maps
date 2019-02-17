import { GlobalContextDispatch, MarkerEvtHandlersType } from 'typings';
import { camelCase } from 'utils';

type defaultMarkerEvtHndsType = {
  evtName: string,
  id: string,
  marker: mapboxgl.Marker,
  ifselected: boolean,
  dispatch: GlobalContextDispatch
  setMarkerStyle: React.Dispatch<React.SetStateAction<"greenMarker" | "blueBigMarker" | "redBigMarker">>
}

type handleMarkerEvtType = {
  evt: string,
  id: string,
  marker: mapboxgl.Marker,
  ifselected: boolean,
  dispatch: GlobalContextDispatch,
  setMarkerStyle: React.Dispatch<React.SetStateAction<"greenMarker" | "blueBigMarker" | "redBigMarker">>
  markerEvtHandlers?: MarkerEvtHandlersType | any
}

export const defaultMarkerEvtHnds = (input: defaultMarkerEvtHndsType) => {
  const { evtName, id, marker, ifselected, dispatch, setMarkerStyle } = input
  switch (evtName) {
    case 'onClick':
      dispatch({
        type: 'SELECT_MARKER',
        payload: id,
      });
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
      return !ifselected && setMarkerStyle('blueBigMarker')
    case 'onMouseout':
      return !ifselected && setMarkerStyle('greenMarker')
    default:
    // throw new Error('No corresponding event')
  }
};

export const handleMarkerEvt = (input: handleMarkerEvtType) => {
  const { evt, id, marker, ifselected, dispatch, setMarkerStyle, markerEvtHandlers } = input
  const evtName = `on${camelCase(evt)}`;
  if (markerEvtHandlers) {
    const customMarkerEvtHnd = markerEvtHandlers[evtName];
    if (customMarkerEvtHnd) {
      customMarkerEvtHnd(marker);
    } else {
      defaultMarkerEvtHnds({ evtName, id, marker, ifselected, dispatch, setMarkerStyle });
    }
  } else {
    defaultMarkerEvtHnds({ evtName, id, marker, ifselected, dispatch, setMarkerStyle });
  }
};
