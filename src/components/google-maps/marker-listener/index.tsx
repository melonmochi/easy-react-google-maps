import { fromEventPattern, merge } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';

const loadGm$ = (evt: string, m: google.maps.Marker) =>
  fromEventPattern(
    handler => m.addListener(evt, handler),
    (_handler, listener) => google.maps.event.removeListener(listener)
  );

const setMouseOverOutStream = (m: google.maps.Marker) => {
  const mouseup$ = loadGm$('mouseup', m);
  const mousedown$ = loadGm$('mousedown', m);
  const mouseover$ = loadGm$('mouseover', m);
  const mouseout$ = loadGm$('mouseout', m);
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

export const loadMarkerStream = (evt: string, m: google.maps.Marker) => {
  switch (evt) {
    case 'mouseout':
      return setMouseOverOutStream(m)[1];
    case 'mouseover':
      return setMouseOverOutStream(m)[0];
    default:
      return loadGm$(evt, m);
  }
};
