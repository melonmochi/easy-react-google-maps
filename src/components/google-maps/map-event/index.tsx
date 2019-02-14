import { camelCase } from 'utils';
import { gmMapEvtHandlersType, GlobalContextDispatch, LatLng } from 'typings';

const defaultMapEventHandler = (
  evtName: string,
  dispatch: GlobalContextDispatch,
  map: google.maps.Map
) => {
  switch (evtName) {
    case 'onIdle':
      console.log('im doing onIdle handler');
      const gCenter = map.getCenter();
      const newCenter = [gCenter.lat(), gCenter.lng()] as LatLng;
      const newZoom = map.getZoom();
      dispatch({
        type: 'SET_VIEW',
        payload: {
          center: newCenter,
          zoom: newZoom,
        },
      });
      break;
    case 'onClick':
      break;
    case 'onDblclick':
      break;
    case 'onRightclick':
      break;
    case 'onZoom_changed':
      break;
    default:
    // throw new Error('No corresponding event')
  }
};

export const handleMapEvent = (
  m: google.maps.Map,
  evt: string,
  dispatch: GlobalContextDispatch,
  gmMapEvtHandlers?: gmMapEvtHandlersType
) => {
  return () => {
    const evtName = `on${camelCase(evt)}`;
    if (gmMapEvtHandlers && gmMapEvtHandlers[evtName]) {
      gmMapEvtHandlers[evtName](m);
    } else {
      defaultMapEventHandler(evtName, dispatch, m);
    }
  };
};
