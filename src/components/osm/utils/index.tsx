import {
  LatLng,
  EvtStreamType,
  setMapConfigInput,
  handleMapEventInput,
  setMarkerConfigInput,
  handleMarkerEventInput,
} from 'typings';
import { fromEventPattern, merge } from 'rxjs';
import { camelCase, markerEvents } from 'utils';
import L from 'leaflet';
import { takeUntil, switchMap } from 'rxjs/operators';

export const osmMapEvents = ['click', 'moveend'];

// ------------------------MAP------------------------

type setOsmMapConfigInput = setMapConfigInput & {
  osmTileLayerServer?: string;
};
type handleOsmMapEventInput = {
  map: L.Map;
} & handleMapEventInput;

export const setOsmMapConfig = (input: setOsmMapConfigInput) => {
  const { center, zoom, osmTileLayerServer } = input;
  return Object.assign(
    {},
    {
      center,
      zoom,
      layers: [
        new L.TileLayer(
          osmTileLayerServer ? osmTileLayerServer : 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        ),
      ],
    }
  );
};

const loadOsm$ = (evt: string, m: L.Map) =>
  fromEventPattern(handler => m.on(evt, handler), handler => m.off(evt, handler));

const loadOsmMapEventsStream = (m: L.Map) =>
  osmMapEvents.reduce((obj: EvtStreamType, e) => {
    obj[e] = loadOsm$(e, m);
    return obj;
  }, {});

export const handleOsmMapEvent = (input: handleOsmMapEventInput) => {
  const { map, e, dispatch, center: c, markersBounds: mb } = input;
  const evtName = `on${camelCase(e)}`;
  switch (evtName) {
    case 'onClick':
      dispatch({ type: 'SELECT_MARKER', payload: '' });
      break;
    case 'onMoveend':
      const newCenter = [map.getCenter().lat, map.getCenter().lng] as LatLng;
      const newZoom = map.getZoom();
      dispatch({
        type: 'SET_VIEW',
        payload: {
          center: newCenter,
          zoom: newZoom,
        },
      });
      break;
    case 'onFit_bounds':
      return mb && map.fitBounds(mb, { padding: [100, 100] });
    case 'onRecenter_map':
      map.panTo(c);
      break;
    default:
      break;
  }
};

export const setMapView = (m: L.Map, c: LatLng, z: number) => {
  m.setView(c, z).invalidateSize();
};

export const combineEventStreams = (m: L.Map, mapTools$: EvtStreamType) => {
  const events$ = Object.assign(loadOsmMapEventsStream(m), mapTools$);
  return Object.keys(events$).reduce((obj: EvtStreamType, e) => {
    obj[e] = events$[e];
    return obj;
  }, {});
};

// ------------------------MARKER------------------------

type setOsmMarkerConfigInput = setMarkerConfigInput;

export const setOsmMarkerConfig = (input: setOsmMarkerConfigInput) => {
  const { title, position, draggable } = input;
  return Object.assign(
    {},
    { position },
    {
      opt: {
        title,
        draggable: draggable ? draggable : false,
      },
    }
  );
};

const loadOsmMarker$ = (evt: string, m: L.Marker) =>
  fromEventPattern(handler => m.on(evt, handler), handler => m.off(evt, handler));

const setOsmMouseOverOutStream = (m: L.Marker) => {
  const mouseup$ = loadOsmMarker$('mouseup', m);
  const mousedown$ = loadOsmMarker$('mousedown', m);
  const mouseover$ = loadOsmMarker$('mouseover', m);
  const mouseout$ = loadOsmMarker$('mouseout', m);
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

const loadOsmMarkerEventStream = (evt: string, m: L.Marker) => {
  switch (evt) {
    case 'mouseout':
      return setOsmMouseOverOutStream(m)[1];
    case 'mouseover':
      return setOsmMouseOverOutStream(m)[0];
    default:
      return loadOsmMarker$(evt, m);
  }
};

export const loadOsmMarkerEventsStream = (m: L.Marker) =>
  markerEvents.reduce((obj: EvtStreamType, e) => {
    obj[e] = loadOsmMarkerEventStream(e, m);
    return obj;
  }, {});

import blueIconURL from 'assets/images/marker-blue.svg';
import orangeIconURL from 'assets/images/marker-orange.svg';
import { osmGreenIcon } from 'osm';

const osmBlueIcon = L.icon({ iconUrl: blueIconURL });
const osmOrangeIcon = L.icon({ iconUrl: orangeIconURL });

export const setDefaultIcon = (m: L.Marker) => {
  m.setIcon(osmGreenIcon);
};
export const setBlueIcon = (m: L.Marker) => {
  m.setIcon(osmBlueIcon);
};
export const setOrangeIcon = (m: L.Marker) => {
  m.setIcon(osmOrangeIcon);
};

type handleOsmMarkerEventInput = handleMarkerEventInput & {
  map: L.Map;
  marker: L.Marker;
};

export const handleOsmMarkerEvent = (input: handleOsmMarkerEventInput) => {
  const { map, evt, id, marker, ifselected, dispatch } = input;
  const evtName = `on${camelCase(evt)}`;
  switch (evtName) {
    case 'onClick':
      dispatch({ type: 'SELECT_MARKER', payload: id });
      break;
    case 'onDblclick':
      map.setView([marker.getLatLng().lat, marker.getLatLng().lng], map.getZoom());
      break;
    case 'onDragend':
      dispatch({
        type: 'CHANGE_MARKER_POSITION',
        payload: { id, newPosition: [marker.getLatLng().lat, marker.getLatLng().lng] },
      });
      break;
    case 'onMouseout':
      return !ifselected && setDefaultIcon(marker);
    case 'onMouseover':
      return !ifselected && setBlueIcon(marker);
    default:
    // throw new Error('No corresponding event')
  }
};
