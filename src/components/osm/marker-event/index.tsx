import { camelCase } from 'utils';
import { MarkerEvtHandlersType, GlobalContextDispatch } from 'typings';

const defaultOSMMarkerEvtHnds = (
  evtName: string,
  id: string,
  m: L.Marker,
  dispatch: GlobalContextDispatch
) => {
  switch (evtName) {
    case 'onDragend':
      dispatch({
        type: 'CHANGE_MARKER_POSITION',
        payload: {
          id: id,
          newPosition: [m.getLatLng().lat, m.getLatLng().lng],
        },
      });
      break;
    default:
    // throw new Error('No corresponding event')
  }
};

export const handleMarkerEvt = (
  evt: string,
  id: string,
  marker: L.Marker,
  dispatch: GlobalContextDispatch,
  markerEvtHandlers?: MarkerEvtHandlersType | any
) => {
  return () => {
    const evtName = `on${camelCase(evt)}`;
    if (markerEvtHandlers) {
      if (markerEvtHandlers[evtName]) {
        markerEvtHandlers[evtName](marker);
      }
    } else {
      defaultOSMMarkerEvtHnds(evtName, id, marker, dispatch);
    }
  };
};
