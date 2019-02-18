import { camelCase, boundsToGmbounds } from 'utils';
import { gmMapEvtHandlersType, GlobalContextDispatch, LatLng, Bounds } from 'typings';

type defaultMapEventHandlerType = {
  map: google.maps.Map;
  evtName: string;
  dispatch: GlobalContextDispatch;
};

type handleMapEventType = {
  map: google.maps.Map;
  evt: string;
  dispatch: GlobalContextDispatch;
  gmMapEvtHandlers?: gmMapEvtHandlersType;
};

type handleMapToolType = {
  map: google.maps.Map;
  tool: string;
  center: LatLng;
  markersBounds?: Bounds;
};

const defaultMapEventHandler = (input: defaultMapEventHandlerType) => {
  const { map, evtName, dispatch } = input;
  switch (evtName) {
    case 'onIdle':
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

export const handleMapEvent = (input: handleMapEventType) => {
  const { map, evt, dispatch, gmMapEvtHandlers } = input;
  const evtName = `on${camelCase(evt)}`;
  if (gmMapEvtHandlers && gmMapEvtHandlers[evtName]) {
    gmMapEvtHandlers[evtName](map);
  } else {
    defaultMapEventHandler({ map, evtName, dispatch });
  }
};

export const handleMapTool = (input: handleMapToolType) => {
  const { map, tool, center: c, markersBounds: mb } = input;
  switch (tool) {
    case 'fitBounds$':
      return mb && map.fitBounds(boundsToGmbounds(mb));
    case 'recenterMap$':
      map.panTo(new google.maps.LatLng(c[0], c[1]));
      break;
    default:
      break;
  }
};
