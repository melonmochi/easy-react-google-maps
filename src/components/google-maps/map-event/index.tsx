import { camelCase } from 'utils';
import { gmMapEvtHandlersType, GlobalContextDispatch, LatLng } from 'typings'

const defaultMapEventHandler = (evtName: string, dispatch: GlobalContextDispatch, map: google.maps.Map) => {
  switch (evtName) {
    case 'onBounds_changed':
      break;
    case 'onClick':
      break;
    case 'onDblclick':
      break;
    case 'onDrag':
      break;
    case 'onCenter_changed':
      const center = map.getCenter()
      const newCenter: LatLng = [center.lat(), center.lng()]
      dispatch({ type: 'CHANGE_CURRENT_CENTER', payload: newCenter  })
      break;
    case 'onRightclick':
      break;
    case 'onZoom_changed':
      dispatch({ type: 'CHANGE_ZOOM', payload: map.getZoom() })
      break;
    default:
    // throw new Error('No corresponding event')
  }
}

export const handleMapEvent = (m: google.maps.Map, evt: string, dispatch: GlobalContextDispatch, gmMapEvtHandlers?: gmMapEvtHandlersType) => {
  return () => {
    const evtName = `on${camelCase(evt)}`;
    if (gmMapEvtHandlers && gmMapEvtHandlers[evtName]) {
      gmMapEvtHandlers[evtName](m);
    } else {
      defaultMapEventHandler(evtName, dispatch, m);
    }
  };
}
