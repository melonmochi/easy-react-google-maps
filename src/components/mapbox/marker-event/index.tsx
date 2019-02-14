import { GlobalContextDispatch, MarkerEvtHandlersType } from 'typings';
import { camelCase } from 'utils';

export const defaultMarkerEvtHnds = (
  evtName: string,
  id: string,
  m: mapboxgl.Marker,
  dispatch: GlobalContextDispatch
) => {
  switch (evtName) {
    case 'onDragend':
      dispatch({
        type: 'CHANGE_MARKER_POSITION',
        payload: {
          id: id,
          newPosition: [m.getLngLat().lat, m.getLngLat().lng],
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
  m: mapboxgl.Marker,
  dispatch: GlobalContextDispatch,
  marEvtHnds?: MarkerEvtHandlersType | any
) => {
  return () => {
    const evtName = `on${camelCase(evt)}`;
    if (marEvtHnds) {
      const customMarkerEvtHnd = marEvtHnds[evtName];
      if (customMarkerEvtHnd) {
        customMarkerEvtHnd(m);
      } else {
        defaultMarkerEvtHnds(evtName, id, m, dispatch);
      }
    } else {
      defaultMarkerEvtHnds(evtName, id, m, dispatch);
    }
  };
};
