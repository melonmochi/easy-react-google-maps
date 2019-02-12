import { camelCase } from 'utils';
import { GlobalContextDispatch, LatLng, mapboxMapEvtHandlersType } from 'typings'

const defaultMapEventHandler = (evtName: string, dispatch: GlobalContextDispatch, map: mapboxgl.Map) => {
  switch (evtName) {
    case 'onClick':
      break;
    case 'onDblclick':
      break;
    case 'onMousemove':
      break;
    case 'onMouseout':
      break;
    case 'onMouseover':
      break;
    case 'onMoveend':
      const center = map.getCenter()
      const newCenter: LatLng = [center.lat, center.lng]
      dispatch({ type: 'CHANGE_CURRENT_CENTER', payload: newCenter  })
      break;
    case 'onContextmenu':
      break;
    case 'onZoomend':
      dispatch({ type: 'CHANGE_ZOOM', payload: Math.round(map.getZoom()) + 1 })
      break;
    default:
    // throw new Error('No corresponding event')
      break;
  }
}

export const handleMapEvent = (m: mapboxgl.Map, evt: string, dispatch: GlobalContextDispatch, osmMapEvtHandlers?: mapboxMapEvtHandlersType) => {
  return () => {
    const evtName = `on${camelCase(evt)}`;
    if (osmMapEvtHandlers && osmMapEvtHandlers[evtName]) {
      osmMapEvtHandlers[evtName](m);
    } else {
      defaultMapEventHandler(evtName, dispatch, m);
    }
  };
}
