import { camelCase } from 'utils';
import { GlobalContextDispatch, LatLng, mapboxMapEvtHandlersType, Bounds } from 'typings';

type defaultMapEventHandlerType = {
  map: mapboxgl.Map;
  evtName: string;
  dispatch: GlobalContextDispatch;
};

type handleMapEventType = {
  map: mapboxgl.Map;
  evt: string;
  dispatch: GlobalContextDispatch;
  mapboxMapEvtHandlers?: mapboxMapEvtHandlersType;
};

type handleMapToolType = {
  map: mapboxgl.Map;
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

export const handleMapEvent = (input: handleMapEventType) => {
  const { map, evt, dispatch, mapboxMapEvtHandlers } = input;
  const evtName = `on${camelCase(evt)}`;
  if (mapboxMapEvtHandlers && mapboxMapEvtHandlers[evtName]) {
    mapboxMapEvtHandlers[evtName](map);
  } else {
    defaultMapEventHandler({ map, evtName, dispatch });
  }
};

export const handleMapTool = (input: handleMapToolType) => {
  const { map, tool, center: c, markersBounds: mb } = input;
  switch (tool) {
    case 'fitBounds$':
      if (mb) {
        const swMapbox = [mb[0][1], mb[0][0]];
        const neMapbox = [mb[1][1], mb[1][0]];
        map.fitBounds([swMapbox, neMapbox] as Bounds, {
          linear: true,
          padding: 100,
        });
      }
      break;
    case 'recenterMap$':
      map.panTo([c[1], c[0]]);
      break;
    default:
      break;
  }
};
