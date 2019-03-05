import {
  LatLng,
  EvtStreamType,
  handleMapEventInput,
  setMapConfigInput,
  Bounds,
  setMarkerConfigInput,
  handleMarkerEventInput,
  AddMarkerToListInputType,
  mapboxMarkerLayerEventType,
  handleMapboxMarkerLayerEventInput,
} from 'typings';
import { fromEventPattern, merge, fromEvent } from 'rxjs';
import { camelCase, markerEvents, markersToMapboxGeoJSON } from 'utils';
import { takeUntil, switchMap, filter } from 'rxjs/operators';
import { Color } from 'csstype';
export const mapboxMapEvents = ['load', 'click', 'dblclick', 'moveend'];
import { Modal } from 'antd';
import { FeatureCollection, Geometry, GeoJsonProperties, Point } from 'geojson';
const confirm = Modal.confirm;
const MapboxMarkerLayerEvents = [
  'click',
  'dblclick',
  'mousedown',
  'mouseup',
  'mouseover',
  'mouseout',
];
import busIconURL from 'components/mapbox/marker/style/images/bus-15.svg';
// ------------------------MAP------------------------

type setMapboxMapConfigInput = setMapConfigInput & {
  mapboxStyle?: string;
};
type handleMapboxMapEventInput = {
  map: mapboxgl.Map;
  markersList: AddMarkerToListInputType[];
} & handleMapEventInput;
type addSourseToMapInput = {
  map: mapboxgl.Map;
  markersSource: FeatureCollection<Geometry, GeoJsonProperties>;
};
type handleMapboxMarkerEventInput = handleMarkerEventInput & {
  map: mapboxgl.Map;
  marker: mapboxgl.Marker;
  setMarkerStyle: React.Dispatch<
    React.SetStateAction<'greenMarker' | 'blueBigMarker' | 'redBigMarker'>
  >;
};
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
  fromEventPattern(handler => m.on(evt, handler), handler => m.off(evt, handler), e => e);

const loadMapboxMapEventsStream = (m: mapboxgl.Map) =>
  mapboxMapEvents.reduce((obj: EvtStreamType, e) => {
    switch (e) {
      case 'click':
        obj[e] = loadMapbox$(e, m).pipe(
          filter(evt => evt.originalEvent.target.tagName === 'CANVAS')
        );
        break;
      default:
        obj[e] = loadMapbox$(e, m);
        break;
    }
    return obj;
  }, {});

export const handleMapboxMapEvent = (input: handleMapboxMapEventInput) => {
  const { map, e, dispatch, center: c, markersBounds: mb, searchBoxPlacesBounds: sbpb } = input;
  const evtName = `on${camelCase(e)}`;
  switch (evtName) {
    case 'onClick':
      dispatch({ type: 'SELECT_MARKER', payload: '' });
      break;
    // case 'onLoad':
    //   const chunkMarkers = chunkArray(markersList, 3) as Array<AddMarkerToListInputType[]>
    //   const markersSource = GeoJSONMarkers(chunkMarkers[0])
    //   addSourseToMap({ map, markersSource })
    //   let i = 1;
    //   const timer = window.setInterval(() => {
    //     const mars = chunkMarkers[i]
    //     if (i < 3 && mars) {
    //       const ms = GeoJSONMarkers(mars)
    //       const newMS = markersSource.features.concat(ms.features);
    //       markersSource.features = newMS
    //       const markers = map.getSource('markers') as GeoJSONSource
    //       markers.setData(markersSource);
    //       i++;
    //     } else {
    //       window.clearInterval(timer);
    //     }
    //   }, 1000);
    //   break;
    case 'onMoveend':
      const newCenter = [map.getCenter().lat, map.getCenter().lng] as LatLng;
      const newZoom = Math.floor(map.getZoom() + 1);
      dispatch({
        type: 'SET_VIEW',
        payload: { center: newCenter, zoom: newZoom },
      });
      break;
    case 'onPlaces_changed':
      if (sbpb) {
        map.fitBounds(boundsToMapboxBounds(sbpb), { linear: true, padding: 100 });
      }
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

const setMapboxMouseOverOutStream = (node: HTMLDivElement, m: mapboxgl.Marker) => {
  const dragend$ = loadMapboxMarkerMapbox$('dragend', m);
  const mousedown$ = loadMapboxMarkerNode$('mousedown', node);
  const mouseover$ = loadMapboxMarkerNode$('mouseover', node);
  const mouseout$ = loadMapboxMarkerNode$('mouseout', node);
  const mouseOver$ = mouseover$.pipe(takeUntil(mousedown$));
  const mouseOut$ = mouseout$.pipe(takeUntil(mousedown$));
  const mouseOv$ = dragend$.pipe(switchMap(() => mouseOver$));
  const mouseOt$ = dragend$.pipe(switchMap(() => mouseOut$));
  // Marble diagram
  // -------------down ----------------- ------------------down
  // oo---oo------|    --oo*--oo*----oo* ------oo----oo----|
  // -------------|    ----------------- dragend----------------|
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
      return setMapboxMouseOverOutStream(node, m)[1];
    case 'mouseover':
      return setMapboxMouseOverOutStream(node, m)[0];
    default:
      return loadMapboxMarkerNode$(evt, node);
  }
};

export const loadMarpboxMarkerEventsStream = (m: mapboxgl.Marker, node: HTMLDivElement) =>
  markerEvents.reduce((obj: EvtStreamType, e) => {
    obj[e] = loadMapboxMarkerEventStream(e, node, m);
    return obj;
  }, {});

export const handleMapboxMarkerEvent = (input: handleMapboxMarkerEventInput) => {
  const { map, evt, id, marker, ifselected, position, dispatch, setMarkerStyle } = input;
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
      confirm({
        centered: true,
        title: 'Do you want to move this marker?',
        content: 'When clicked the OK button, the marker position will be changed',
        onOk() {
          dispatch({
            type: 'CHANGE_MARKER_POSITION',
            payload: { id, newPosition: [marker.getLngLat().lat, marker.getLngLat().lng] },
          });
        },
        onCancel() {
          marker.setLngLat([position[1], position[0]]);
        },
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

export const GeoJSONMarkers = (ml: AddMarkerToListInputType[]) =>
  markersToMapboxGeoJSON(
    ml.map(m => ({
      id: m.id,
      title: m.props.title,
      position: m.props.position,
    }))
  );

export const addSourseToMap = (input: addSourseToMapInput) => {
  const { map, markersSource } = input;
  map.addSource('markers', {
    type: 'geojson',
    data: markersSource,
    cluster: true,
  });
  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'markers',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 100, '#f1f075', 750, '#f28cb1'],
      'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
    },
  });
  map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'markers',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 12,
    },
  });

  const img = new Image(15, 15);
  img.onload = () => map.addImage('bus', img, { sdf: true });
  img.src = busIconURL;

  map.addLayer({
    id: 'unclustered-point',
    type: 'symbol',
    source: 'markers',
    filter: ['!', ['has', 'point_count']],
    layout: {
      'icon-image': 'bus',
      'icon-size': 1.5,
      'text-field': '{title}',
      'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
      'text-offset': [0, 0.6],
      'text-anchor': 'top',
    },
    paint: {
      'icon-color': ['case', ['boolean', ['feature-state', 'hover'], false], '#005CAF', '#0c4842'],
    },
  });

  // inspect a cluster on click
  map.on('click', 'clusters', e => {
    const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
    const firstFeature = features[0];
    if (firstFeature && firstFeature.properties) {
      const clusterId = firstFeature ? firstFeature.properties.cluster_id : '';
      const source = map.getSource('markers') as mapboxgl.GeoJSONSource;
      source.getClusterExpansionZoom(clusterId, (err, z) => {
        if (err) return;
        map.easeTo({
          center: (features[0].geometry as Point).coordinates as LatLng,
          zoom: z,
        });
      });
    }
  });
  map.on('mouseenter', 'clusters', function() {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'clusters', function() {
    map.getCanvas().style.cursor = '';
  });
};

const loadMarkerLayer$ = (evt: mapboxMarkerLayerEventType, layerID: string, m: mapboxgl.Map) =>
  fromEventPattern(
    handler => m.on(evt, layerID, handler),
    handler => m.off(evt, layerID, handler),
    e => e
  );

const loadUnclusteredMarkerLayer$ = (evt: mapboxMarkerLayerEventType, m: mapboxgl.Map) =>
  loadMarkerLayer$(evt, 'unclustered-point', m);

export const loadMarpboxMarkerLayerEventsStream = (m: mapboxgl.Map) =>
  MapboxMarkerLayerEvents.reduce((obj: EvtStreamType, evt) => {
    obj[evt] = loadUnclusteredMarkerLayer$(evt as mapboxMarkerLayerEventType, m);
    return obj;
  }, {});

let featureID = 0;

export const handleMapboxMarkerLayerEvent = (input: handleMapboxMarkerLayerEventInput) => {
  const { evt, map, e } = input;
  const evtName = `on${camelCase(evt)}`;
  const feature = map.queryRenderedFeatures(e.point, { layers: ['unclustered-point'] })[0];
  if (feature && feature.id) {
    featureID = feature.id as number;
  }

  switch (evtName) {
    case 'onClick':
      // dispatch({
      //   type: 'SELECT_MARKER',
      //   payload: id,
      // });
      break;
    case 'onDblclick':
      break;
    case 'onMouseover':
      map.setFeatureState(
        { source: 'markers', id: featureID },
        {
          hover: true,
        }
      );
      break;
    case 'onMouseout':
      map.setFeatureState(
        { source: 'markers', id: featureID },
        {
          hover: false,
        }
      );
      /*const markers = map.getSource('markers') as GeoJSONSource
          markers.setData(markersSource);*/
      break;
    default:
    // throw new Error('No corresponding event')
  }
};

export const latlngToMapboxLngLat = (pos: LatLng) => {
  return [pos[1], pos[0]] as LatLng;
};
