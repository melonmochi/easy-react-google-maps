import { fromEventPattern, of } from 'rxjs';
import { filter } from 'rxjs/operators';

const loadGm$ = (evt: string, m: google.maps.Map) =>
  fromEventPattern(
    handler => m.addListener(evt, handler),
    (_handler, listener) => google.maps.event.removeListener(listener)
  );

export const loadMapStream = (evt: string, m: google.maps.Map) => {
  switch (evt) {
    default:
      return loadGm$(evt, m);
  }
};

export const loadMapToolStream = (evt: string, toolState: boolean) => ({
  evt,
  e$: of(toolState).pipe(filter(() => toolState)),
});
