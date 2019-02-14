import { camelCase } from 'utils';
import { MarkerEvtHandlersType } from 'typings';

const defaultOSMMarkerEventHandler = (evtName: string, _e: Event, _marker: L.Marker) => {
  switch (evtName) {
    case 'onClick':
      break;
    case 'onDblclick':
      break;
    case 'onRightclick':
      break;
    case 'onDrag':
    case 'onDragend':
    default:
    // throw new Error('No corresponding event')
  }
};

export const handleMarkerEvent = (
  marker: L.Marker,
  evt: string,
  markerEvtHandlers?: MarkerEvtHandlersType | any
) => {
  return (e: Event) => {
    const evtName = `on${camelCase(evt)}`;
    if (markerEvtHandlers) {
      if (markerEvtHandlers[evtName]) {
        markerEvtHandlers[evtName](marker);
      }
    } else {
      defaultOSMMarkerEventHandler(evtName, e, marker);
    }
  };
};
