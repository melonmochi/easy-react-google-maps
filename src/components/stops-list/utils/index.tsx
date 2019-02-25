import { EvtStreamType } from 'typings';
import { fromEvent } from 'rxjs';

const MarkerItemEvents = [
  'click',
  'dblclick',
]

const loadMarkerItem$ = (evt: string, node: HTMLDivElement) =>
  fromEvent(node, evt)

export const setMarkerItemStream = (node: HTMLDivElement) =>
  MarkerItemEvents.reduce((obj: EvtStreamType, e) => {
    obj[`marker_item_${e}`] = loadMarkerItem$(e, node);
    return obj;
  }, {})
