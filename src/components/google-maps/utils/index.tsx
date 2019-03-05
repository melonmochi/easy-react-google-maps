import {
  GestureHandlingType,
  MapTypeId,
  LatLng,
  EvtStreamType,
  handleMapEventInput,
  setMarkerConfigInput,
  GmMarkerAnimationType,
  handleMarkerEventInput,
  GlobalContextDispatch,
} from 'typings';
import { fromEventPattern, Observable, merge } from 'rxjs';
import { boundsToGmbounds, camelCase, markerEvents, gmBoundsToBounds } from 'utils';
import { setMapConfigInput } from 'typings';
import { takeUntil, switchMap } from 'rxjs/operators';
import blueIconURL from 'assets/images/marker-blue.svg';
import orangeIconURL from 'assets/images/marker-orange.svg';
import { Modal } from 'antd';
const confirm = Modal.confirm;

const gmMapEvents = ['click', 'idle'];

// ------------------------MAP------------------------

type setGmMapConfigInput = setMapConfigInput & {
  gestureHandling?: GestureHandlingType;
  gmMaptype?: MapTypeId;
};
type handleGmMapEventInput = {
  map: google.maps.Map;
} & handleMapEventInput;

export const setGmMapConfig = (input: setGmMapConfigInput) => {
  const { center, gestureHandling, gmMaptype, zoom } = input;
  return Object.assign(
    {},
    {
      center: { lat: center[0], lng: center[1] },
      gestureHandling,
      mapTypeId: gmMaptype ? google.maps.MapTypeId[gmMaptype] : google.maps.MapTypeId.ROADMAP, // optional main map layer. Terrain, satellite, hybrid or roadmap--if unspecified, defaults to roadmap.
      zoom, // sets zoom. Lower numbers are zoomed further out.
      mapTypeControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT,
      },
      fullscreenControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP,
      },
    }
  );
};

const loadGm$ = (evt: string, m: google.maps.Map) =>
  fromEventPattern(
    handler => m.addListener(evt, handler),
    (_handler, listener) => google.maps.event.removeListener(listener)
  );

const loadMapEventStream = (evt: string, m: google.maps.Map) => {
  switch (evt) {
    default:
      return loadGm$(evt, m);
  }
};

export const loadGmMapEventsStream = (m: google.maps.Map) =>
  gmMapEvents.reduce((obj: { [e: string]: Observable<{}> }, e) => {
    obj[e] = loadMapEventStream(e, m);
    return obj;
  }, {});

export const handleGmMapEvent = (input: handleGmMapEventInput) => {
  const { map, e, dispatch, center: c, markersBounds: mb, searchBoxPlacesBounds: sbpb } = input;
  const evtName = `on${camelCase(e)}`;
  switch (evtName) {
    case 'onClick':
      dispatch({ type: 'SELECT_MARKER', payload: '' });
      break;
    case 'onIdle':
      const gCenter = map.getCenter();
      const center = [gCenter.lat(), gCenter.lng()] as LatLng;
      const zoom = map.getZoom();
      dispatch({ type: 'SET_VIEW', payload: { center, zoom } });
      break;
    case 'onFit_bounds':
      return mb && map.fitBounds(boundsToGmbounds(mb));
    case 'onPlaces_changed':
      return sbpb && map.fitBounds(boundsToGmbounds(sbpb));
    case 'onRecenter_map':
      map.panTo(new google.maps.LatLng(c[0], c[1]));
      break;
    default:
      break;
  }
};

export const setMapView = (m: google.maps.Map, z: number, c: LatLng) => {
  m.setOptions({ center: new google.maps.LatLng(c[0], c[1]), zoom: z });
};

export const combineEventStreams = (m: google.maps.Map, mapTools$: EvtStreamType) => {
  const events$ = Object.assign(loadGmMapEventsStream(m), mapTools$);
  return Object.keys(events$).reduce((obj: EvtStreamType, e) => {
    obj[e] = events$[e];
    return obj;
  }, {});
};

// ------------------------MARKER------------------------

type setGmMarkerConfigInput = setMarkerConfigInput & {
  map: google.maps.Map;
  withLabel?: boolean;
  label?: string;
  animation?: GmMarkerAnimationType;
};

export const setGmMarkerConfig = (input: setGmMarkerConfigInput) => {
  const { title, position, draggable, map, withLabel, label, animation } = input;
  const gmLabel = label ? labelInTwoString(label) : labelInTwoString(title);
  return Object.assign(
    {},
    {
      map,
      icon: '',
      title,
      position: new google.maps.LatLng(position[0], position[1]),
      label: withLabel ? gmLabel : undefined,
      draggable,
      animation: animation ? google.maps.Animation[animation] : undefined,
    }
  );
};

const loadGmMarker$ = (evt: string, m: google.maps.Marker) =>
  fromEventPattern(
    handler => m.addListener(evt, handler),
    (_handler, listener) => google.maps.event.removeListener(listener)
  );

const setGmMouseOverOutStream = (m: google.maps.Marker) => {
  const mouseup$ = loadGmMarker$('mouseup', m);
  const mousedown$ = loadGmMarker$('mousedown', m);
  const mouseover$ = loadGmMarker$('mouseover', m);
  const mouseout$ = loadGmMarker$('mouseout', m);
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

export const loadGmMarkerStream = (evt: string, m: google.maps.Marker) => {
  switch (evt) {
    case 'mouseout':
      return setGmMouseOverOutStream(m)[1];
    case 'mouseover':
      return setGmMouseOverOutStream(m)[0];
    default:
      return loadGmMarker$(evt, m);
  }
};

export const setMarkerEventStream = (m: google.maps.Marker) =>
  markerEvents.reduce((obj: EvtStreamType, e) => {
    obj[e] = loadGmMarkerStream(e, m);
    return obj;
  }, {});

type handleGmMarkerEventInput = handleMarkerEventInput & {
  map: google.maps.Map;
  marker: google.maps.Marker;
};

export const setDefaultIcon = (m: google.maps.Marker) => {
  m.setIcon('');
};
export const setBlueIcon = (m: google.maps.Marker) => {
  m.setIcon({
    url: blueIconURL,
    labelOrigin: new google.maps.Point(25, 20),
    anchor: new google.maps.Point(25, 50),
    scaledSize: new google.maps.Size(50, 50),
  });
};

export const setOrangeIcon = (m: google.maps.Marker) =>
  m.setIcon({
    url: orangeIconURL,
    labelOrigin: new google.maps.Point(25, 20),
    anchor: new google.maps.Point(25, 50),
    scaledSize: new google.maps.Size(50, 50),
  });

export const handleGmMarkerEvent = (input: handleGmMarkerEventInput) => {
  const { map, evt, id, marker, position, ifselected, dispatch } = input;
  const evtName = `on${camelCase(evt)}`;
  switch (evtName) {
    case 'onClick':
      dispatch({ type: 'SELECT_MARKER', payload: id });
      break;
    case 'onDblclick':
      map.panTo(new google.maps.LatLng(marker.getPosition().lat(), marker.getPosition().lng()));
      break;
    case 'onDragend':
      confirm({
        centered: true,
        title: 'Do you want to move this marker?',
        content: 'When clicked the OK button, the marker position will be changed',
        onOk() {
          dispatch({
            type: 'CHANGE_MARKER_POSITION',
            payload: {
              id: id,
              newPosition: [marker.getPosition().lat(), marker.getPosition().lng()],
            },
          });
        },
        onCancel() {
          marker.setPosition(new google.maps.LatLng(position[0], position[1]));
          dispatch({
            type: 'CHANGE_MARKER_POSITION',
            payload: {
              id: id,
              newPosition: [marker.getPosition().lat(), marker.getPosition().lng()],
            },
          });
        },
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

export const labelInTwoString = (label: string) => {
  const splitedLabel = label.split(' ');
  switch (splitedLabel.length) {
    case 1:
      return splitedLabel[0].substr(0, 2);
    default:
      return splitedLabel[0].charAt(0) + splitedLabel[1].charAt(0);
  }
};

// ------------------------SEARCH_BOX------------------------
const gmSearchBoxEvents = ['places_changed'];

const loadGmSearchBox$ = (evt: string, sb: google.maps.places.SearchBox) =>
  fromEventPattern(
    handler => sb.addListener(evt, handler),
    (_handler, listener) => google.maps.event.removeListener(listener)
  );

export const loadGmSearchBoxEventsStream = (sb: google.maps.places.SearchBox) =>
  gmSearchBoxEvents.reduce((obj: { [e: string]: Observable<{}> }, e) => {
    obj[e] = loadGmSearchBox$(e, sb);
    return obj;
  }, {});

type handleGmSearchBoxEventInput = {
  e: string;
  searchBox: google.maps.places.SearchBox;
  dispatch: GlobalContextDispatch;
};

export const handleGmSearchBoxEvent = (input: handleGmSearchBoxEventInput) => {
  const { e, searchBox, dispatch } = input;
  const evtName = `on${camelCase(e)}`;
  switch (evtName) {
    case 'onPlaces_changed':
      const places = searchBox.getPlaces();
      const bounds = new google.maps.LatLngBounds();
      if (places.length !== 0) {
        places.forEach(place => {
          if (!place.geometry) {
            throw new Error('Returned place contains no geometry');
          } else {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          }
        });
        dispatch({ type: 'SET_SEARCH_BOX_PLACES_BOUNDS', payload: gmBoundsToBounds(bounds) });
      }
      break;
    default:
    // throw new Error('No corresponding event')
  }
};

export const latlngToGmLatlng = (pos: LatLng) => {
  return new google.maps.LatLng(pos[0], pos[1]);
};
