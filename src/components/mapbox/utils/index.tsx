import {
  LatLng,
  EvtStreamType,
  handleMapEventInput,
  setMapConfigInput,
  Bounds,
  setMarkerConfigInput,
  handleMarkerEventInput,
} from 'typings';
import { fromEventPattern, merge, fromEvent } from 'rxjs';
import { camelCase, markerEvents } from 'utils';
import { takeUntil, switchMap } from 'rxjs/operators';
import { Color } from 'csstype';

export const mapboxMapEvents = ['moveend', 'dblclick'];

// ------------------------MAP------------------------

type setMapboxMapConfigInput = setMapConfigInput & {
  mapboxStyle?: string;
};

type handleMapboxMapEventInput = {
  map: mapboxgl.Map;
} & handleMapEventInput;

export const setMapboxMapConfig = (input: setMapboxMapConfigInput) => {
  const { center, zoom, mapboxStyle } = input;
  return Object.assign(
    {},
    {
      center: [center[1], center[0]] as LatLng,
      zoom: zoom - 1,
      style: mapboxStyle ? mapboxStyle : 'mapbox://styles/mapbox/streets-v9',
    }
  );
};

const loadMapbox$ = (evt: string, m: mapboxgl.Map) =>
  fromEventPattern(handler => m.on(evt, handler), handler => m.off(evt, handler));

const loadMapboxMapEventsStream = (m: mapboxgl.Map) =>
  mapboxMapEvents.reduce((obj: EvtStreamType, e) => {
    obj[e] = loadMapbox$(e, m);
    return obj;
  }, {});

export const handleMapboxMapEvent = (input: handleMapboxMapEventInput) => {
  const { map, e, dispatch, center: c, markersBounds: mb } = input;
  const evtName = `on${camelCase(e)}`;
  console.log('im handling mapbox evet', evtName);
  switch (evtName) {
    case 'onMoveend':
      const newCenter = [map.getCenter().lat, map.getCenter().lng] as LatLng;
      const newZoom = Math.floor(map.getZoom() + 1);
      dispatch({
        type: 'SET_VIEW',
        payload: { center: newCenter, zoom: newZoom },
      });
      break;
    case 'onFit_bounds':
      if (mb) {
        map.fitBounds(boundsToMapboxBounds(mb), { linear: true, padding: 100 });
      }
      break;
    case 'onRecenter_map':
      map.panTo([c[1], c[0]]);
      break;
    default:
      break;
  }
};

export const setMapView = (m: mapboxgl.Map, c: LatLng, z: number) => {
  m.jumpTo({ center: [c[1], c[0]], zoom: z - 1 }).resize();
};

export const combineEventStreams = (m: mapboxgl.Map, mapTools$: EvtStreamType) => {
  const events$ = Object.assign(loadMapboxMapEventsStream(m), mapTools$);
  return Object.keys(events$).reduce((obj: EvtStreamType, e) => {
    obj[e] = events$[e];
    return obj;
  }, {});
};

const boundsToMapboxBounds = (mb: Bounds) => {
  const swMapbox = [mb[0][1], mb[0][0]];
  const neMapbox = [mb[1][1], mb[1][0]];
  return [swMapbox, neMapbox] as Bounds;
};

// ------------------------MARKER------------------------

type setMapboxMarkerConfigInput = setMarkerConfigInput & {
  color?: Color;
};

export const setMapboxMarkerConfig = (input: setMapboxMarkerConfigInput) => {
  const { color: c, position, draggable } = input;
  return Object.assign(
    {},
    { position: [position[1], position[0]] as LatLng },
    {
      opt: {
        color: c ? c : '#0c4842',
        draggable: draggable ? draggable : false,
      },
    }
  );
};

const loadMapboxMarkerNode$ = (evt: string, node: HTMLDivElement) => fromEvent(node, evt);
const loadMapboxMarkerMapbox$ = (e: string, m: mapboxgl.Marker) =>
  fromEventPattern(handler => m.on(e, handler), handler => m.off(e, handler));

const setMapboxMouseOverOutStream = (node: HTMLDivElement) => {
  const mouseup$ = loadMapboxMarkerNode$('mouseup', node);
  const mousedown$ = loadMapboxMarkerNode$('mousedown', node);
  const mouseover$ = loadMapboxMarkerNode$('mouseover', node);
  const mouseout$ = loadMapboxMarkerNode$('mouseout', node);
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

export const loadMapboxMarkerEventStream = (
  evt: string,
  node: HTMLDivElement,
  m: mapboxgl.Marker
) => {
  switch (evt) {
    case 'dragend':
      return loadMapboxMarkerMapbox$(evt, m);
    case 'mouseout':
      return setMapboxMouseOverOutStream(node)[1];
    case 'mouseover':
      return setMapboxMouseOverOutStream(node)[0];
    default:
      return loadMapboxMarkerNode$(evt, node);
  }
};

export const loadMarpboxMarkerEventsStream = (m: mapboxgl.Marker, node: HTMLDivElement) =>
  markerEvents.reduce((obj: EvtStreamType, e) => {
    obj[e] = loadMapboxMarkerEventStream(e, node, m);
    return obj;
  }, {});

type handleMapboxMarkerEventInput = handleMarkerEventInput & {
  map: mapboxgl.Map;
  marker: mapboxgl.Marker;
  setMarkerStyle: React.Dispatch<
    React.SetStateAction<'greenMarker' | 'blueBigMarker' | 'redBigMarker'>
  >;
};

export const handleMapboxMarkerEvent = (input: handleMapboxMarkerEventInput) => {
  const { map, evt, id, marker, ifselected, dispatch, setMarkerStyle } = input;
  const evtName = `on${camelCase(evt)}`;
  switch (evtName) {
    case 'onClick':
      dispatch({
        type: 'SELECT_MARKER',
        payload: id,
      });
      break;
    case 'onDblclick':
      map.panTo(marker.getLngLat());
      break;
    case 'onDragend':
      dispatch({
        type: 'CHANGE_MARKER_POSITION',
        payload: { id, newPosition: [marker.getLngLat().lat, marker.getLngLat().lng] },
      });
      break;
    case 'onMouseover':
      return !ifselected && setMarkerStyle('blueBigMarker');
    case 'onMouseout':
      return !ifselected && setMarkerStyle('greenMarker');
    default:
    // throw new Error('No corresponding event')
  }
};
