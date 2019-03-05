import { EvtStreamType, GlobalContextDispatch, LatLng } from 'typings';
import { fromEvent } from 'rxjs';
import { camelCase } from 'utils';

const MarkerItemEvents = ['click', 'dblclick'];

const loadMarkerItem$ = (evt: string, node: HTMLDivElement) => fromEvent(node, evt);

export const setMarkerItemStream = (node: HTMLDivElement) =>
  MarkerItemEvents.reduce((obj: EvtStreamType, e) => {
    obj[e] = loadMarkerItem$(e, node);
    return obj;
  }, {});

type handleMarkerItemEvtInput = {
  e: string,
  id: string,
  position: LatLng,
  dispatch: GlobalContextDispatch,
}
export const handleMarkerItemEvt = (input: handleMarkerItemEvtInput) => {
  const { e, id, position, dispatch } = input
  const evtName = `on${camelCase(e)}`;
  switch (evtName) {
    case 'onClick':
      dispatch({ type: 'SELECT_MARKER', payload: id });
      break;
    case 'onDblclick':
      dispatch({ type: 'SET_VIEW', payload: { center: position }})
      dispatch({ type: 'UPDATE_VIEW' })
      break;
    default:
      break;
  }
}
