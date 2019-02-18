import { camelCase } from 'utils';
import { GlobalContextDispatch, LatLng, osmMapEvtHandlersType, Bounds } from 'typings';

type defaultMapEventHandlerType = {
  map: L.Map;
  evtName: string;
  dispatch: GlobalContextDispatch;
};

type handleMapEventType = {
  map: L.Map;
  evt: string;
  dispatch: GlobalContextDispatch;
  osmMapEvtHandlers?: osmMapEvtHandlersType;
};

type handleMapToolType = {
  map: L.Map;
  tool: string;
  center: LatLng;
  markersBounds?: Bounds;
};

const defaultMapEventHandler = (input: defaultMapEventHandlerType) => {
  const { map, evtName, dispatch } = input;
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

export const handleMapEvent = (input: handleMapEventType) => {
  const { map, evt, dispatch, osmMapEvtHandlers } = input;
  const evtName = `on${camelCase(evt)}`;
  if (osmMapEvtHandlers && osmMapEvtHandlers[evtName]) {
    osmMapEvtHandlers[evtName](map);
  } else {
    defaultMapEventHandler({ map, evtName, dispatch });
  }
};

export const handleMapTool = (input: handleMapToolType) => {
  const { map, tool, center: c, markersBounds: mb } = input;
  switch (tool) {
    case 'fitBounds$':
      if (mb) {
        map.fitBounds(mb);
      }
      break;
    case 'recenterMap$':
      map.panTo(c);
      break;
    default:
      break;
  }
};
