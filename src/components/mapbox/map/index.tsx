import 'components/style';
import 'mapbox-gl/src/css/mapbox-gl.css';
import React, { FunctionComponent, useEffect, useContext, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { EvtStreamType, AddMarkerToListInputType } from 'typings';
import { GlobalContext } from 'components';
import {
  setMapboxMapConfig,
  setMapView,
  combineEventStreams,
  handleMapboxMapEvent,
  Marker,
} from 'mapbox';
import { Spin } from 'antd';
import { Subscription } from 'rxjs';
import { boundsToMapboxBounds } from 'src/components/utils/bounds-converter';

interface MapboxMapProps {
  token: string;
}

export const MapboxMap: FunctionComponent<MapboxMapProps> = props => {
  const { token } = props;
  const { state, dispatch } = useContext(GlobalContext);
  const {
    center,
    mapCardWidth,
    mapProps,
    mapProvider,
    mapTools$,
    mapView,
    markersBounds,
    markersList,
    searchBoxPlacesBounds,
    updateBounds,
    updateView,
    zoom,
  } = state;
  const { mapboxStyle } = mapProps;
  const mapConfig = setMapboxMapConfig({ center, zoom, mapboxStyle });
  mapboxgl.accessToken = token;
  const mapboxMapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [mapboxEvents$, setMapboxEvents$] = useState<EvtStreamType>({});
  // const [markerLayerEvents$, setMarkerLayerEvents$] = useState<EvtStreamType>({});

  const initMap = (node: HTMLDivElement) =>
    new mapboxgl.Map({
      container: node,
      doubleClickZoom: false,
      ...mapConfig,
    });

  useEffect(() => {
    if (mapboxMapRef.current) {
      const m = initMap(mapboxMapRef.current);
      setMap(m);
      setMapboxEvents$(combineEventStreams(m, mapTools$));
      // setMarkerLayerEvents$(loadMarpboxMarkerLayerEventsStream(m))
    }
  }, []);

  // useEffect(() => {
  //   let evtSubsc: Array<Subscription> = [];
  //   if (map && mapProvider === 'mapbox') {
  //     evtSubsc = Object.keys(markerLayerEvents$).map( (evt: mapboxMarkerLayerEventType) =>
  //       markerLayerEvents$[evt].subscribe( (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] | undefined; } & mapboxgl.EventData) =>
  //         handleMapboxMarkerLayerEvent({ evt, e, map, dispatch })
  //       )
  //     );
  //   }
  //   return () => evtSubsc.forEach(s => s.unsubscribe());
  // },[markerLayerEvents$])

  useEffect(() => {
    if (map) {
      setMapboxEvents$(combineEventStreams(map, mapTools$));
    }
  }, [mapTools$]);

  useEffect(() => {
    let evtSubsc: Array<Subscription> = [];
    if (map && mapProvider === 'mapbox') {
      setMapView(map, mapView.center, mapView.zoom);
      evtSubsc = Object.keys(mapboxEvents$).map(e =>
        mapboxEvents$[e].subscribe(() =>
          handleMapboxMapEvent({ map, e, dispatch, center, markersList, markersBounds })
        )
      );
    }
    return () => evtSubsc.forEach(s => s.unsubscribe());
  }, [mapProvider, mapboxEvents$, center]);

  useEffect(() => {
    if (map && mapProvider === 'mapbox') {
      setTimeout(() => map.resize(), 1);
    }
  }, [mapCardWidth]);

  useEffect(() => {
    if (map) {
      handleMapboxMapEvent({
        map,
        e: 'places_changed',
        dispatch,
        center,
        markersList,
        searchBoxPlacesBounds,
      });
    }
  }, [searchBoxPlacesBounds]);

  useEffect(() => {
    if (map && mapProvider === 'mapbox') {
      setMapView(map, mapView.center, mapView.zoom);
    }
  }, [updateView]);

  useEffect(() => {
    if (map && mapProvider === 'mapbox' && markersBounds) {
      map.fitBounds(boundsToMapboxBounds(markersBounds), { linear: true, padding: 100 });
    }
  }, [updateBounds]);

  const Markers = (mmap: mapboxgl.Map) =>
    markersList
      .filter(m => !m.hide)
      .map((m: AddMarkerToListInputType) => (
        <Marker key={m.id} id={m.id} props={m.props} map={mmap} />
      ));

  return (
    <div
      className="defaultContainer"
      style={{ visibility: mapProvider === 'mapbox' ? 'visible' : 'hidden' }}
    >
      <div className="defaultMap" ref={mapboxMapRef} />
      <Spin
        tip="Loading Map..."
        spinning={!map}
        size="large"
        style={{ width: 0, margin: 'auto', zIndex: 11 }}
      />
      {map ? Markers(map) : null}
    </div>
  );
};
