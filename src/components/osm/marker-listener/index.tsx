import { fromEventPattern, merge } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';

const loadOSM$ = (evt: string, m: L.Marker) =>
  fromEventPattern(handler => m.on(evt, handler), handler => m.off(evt, handler));

const setMouseOverOutStream = (m: L.Marker) => {
  const mouseup$ = loadOSM$('mouseup', m);
  const mousedown$ = loadOSM$('mousedown', m);
  const mouseover$ = loadOSM$('mouseover', m);
  const mouseout$ = loadOSM$('mouseout', m);
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

export const loadStream = (evt: string, m: L.Marker) => {
  switch (evt) {
    case 'mouseout':
      return setMouseOverOutStream(m)[1];
    case 'mouseover':
      return setMouseOverOutStream(m)[0];
    default:
      return loadOSM$(evt, m);
  }
};
