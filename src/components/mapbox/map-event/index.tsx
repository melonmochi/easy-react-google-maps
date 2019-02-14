import { camelCase } from 'utils';
import { GlobalContextDispatch, LatLng, mapboxMapEvtHandlersType } from 'typings';

const defaultMapEventHandler = (
  evtName: string,
  dispatch: GlobalContextDispatch,
  map: mapboxgl.Map
) => {
  switch (evtName) {
    case 'onClick':
      break;
    case 'onDblclick':
      break;
    case 'onMoveend':
      const newCenter = [map.getCenter().lat, map.getCenter().lng] as LatLng;
      const newZoom = Math.floor(map.getZoom() + 1);
      dispatch({
        type: 'SET_VIEW',
        payload: {
          center: newCenter,
          zoom: newZoom,
        },
      });
      break;
    case 'onContextmenu':
      break;
    default:
      // throw new Error('No corresponding event')
      break;
  }
};

export const handleMapEvent = (
  m: mapboxgl.Map,
  evt: string,
  dispatch: GlobalContextDispatch,
  osmMapEvtHandlers?: mapboxMapEvtHandlersType
) => {
  return () => {
    const evtName = `on${camelCase(evt)}`;
    if (osmMapEvtHandlers && osmMapEvtHandlers[evtName]) {
      osmMapEvtHandlers[evtName](m);
    } else {
      defaultMapEventHandler(evtName, dispatch, m);
    }
  };
};
