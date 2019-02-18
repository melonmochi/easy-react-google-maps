import { merge, fromEvent, fromEventPattern } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';

const loadMarkerNode$ = (evt: string, node: HTMLDivElement) => fromEvent(node, evt);
const loadMarkerMapbox$ = (e: string, m: mapboxgl.Marker) =>
  fromEventPattern(handler => m.on(e, handler), handler => m.off(e, handler));

const setMouseOverOutStream = (node: HTMLDivElement) => {
  const mouseup$ = loadMarkerNode$('mouseup', node);
  const mousedown$ = loadMarkerNode$('mousedown', node);
  const mouseover$ = loadMarkerNode$('mouseover', node);
  const mouseout$ = loadMarkerNode$('mouseout', node);
  const mouseOver$ = mouseover$.pipe(takeUntil(mousedown$));
  const mouseOut$ = mouseout$.pipe(takeUntil(mousedown$));
  const mouseOv$ = mouseup$.pipe(switchMap(() => mouseOver$));
  const mouseOt$ = mouseup$.pipe(switchMap(() => mouseOut$));
  // Marble diagram
  // -------------down ----------------- ------------------down
  // oo---oo------|    --oo*--oo*----oo* ------oo----oo----|
  // -------------|    ----------------- up----------------|
  return [merge(mouseOver$, mouseOv$), merge(mouseOut$, mouseOt$)];
};

export const loadStream = (evt: string, node: HTMLDivElement, m: mapboxgl.Marker) => {
  switch (evt) {
    case 'dragend':
      return loadMarkerMapbox$(evt, m);
    case 'mouseout':
      return setMouseOverOutStream(node)[1];
    case 'mouseover':
      return setMouseOverOutStream(node)[0];
    default:
      return loadMarkerNode$(evt, node);
  }
};
