import { camelCase } from 'utils';
import { GlobalContextDispatch, LatLng, osmMapEvtHandlersType } from 'typings';

const defaultMapEventHandler = (evtName: string, dispatch: GlobalContextDispatch, map: L.Map) => {
  switch (evtName) {
    case 'onClick':
      break;
    case 'onDblclick':
      break;
    case 'onMoveend':
      const newCenter = [map.getCenter().lat, map.getCenter().lng] as LatLng;
      const newZoom = map.getZoom();
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
  m: L.Map,
  evt: string,
  dispatch: GlobalContextDispatch,
  osmMapEvtHandlers?: osmMapEvtHandlersType
) => {
  return () => {
    console.log('im doing osm evt handle');
    const evtName = `on${camelCase(evt)}`;
    if (osmMapEvtHandlers && osmMapEvtHandlers[evtName]) {
      osmMapEvtHandlers[evtName](m);
    } else {
      defaultMapEventHandler(evtName, dispatch, m);
    }
  };
};
