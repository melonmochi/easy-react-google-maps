import 'components/style';
import 'mapbox-gl/src/css/mapbox-gl.css';
import React, { FunctionComponent, useEffect, useContext, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { AddMarkerToListInputType, EvtStreamType } from 'typings';
import { GlobalContext } from 'components';
import {
  Marker,
  setMapboxMapConfig,
  setMapView,
  combineEventStreams,
  handleMapboxMapEvent,
  handleMapboxMarkerItemEvent,
} from 'mapbox';
import { Spin } from 'antd';
import { Subscription } from 'rxjs';
import { mapboxConfig } from 'config';

export const MapboxMap: FunctionComponent = () => {
  const { state, dispatch } = useContext(GlobalContext);
  const {
    center,
    mapCardWidth,
    mapProps,
    mapProvider,
    mapTools$,
    mapView,
    markerItem$,
    markersBounds,
    markersList,
    searchBoxPlacesBounds,
    zoom,
  } = state;
  const { mapboxToken, mapboxStyle } = mapProps;
  mapboxgl.accessToken = mapboxToken ? mapboxToken : mapboxConfig.token;
  const mapConfig = setMapboxMapConfig({ center, zoom, mapboxStyle });
  const mapboxMapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [mapboxEvents$, setMapboxEvents$] = useState<EvtStreamType>({});

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
    }
  }, []);

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
          handleMapboxMapEvent({ map, e, dispatch, center, markersBounds })
        )
      );
    }
    return () => evtSubsc.forEach(s => s.unsubscribe());
  }, [mapProvider, mapboxEvents$, center, markersBounds]);

  useEffect(() => {
    if (map && mapProvider === 'mapbox') {
      setTimeout(() => map.resize(), 1);
    }
  }, [mapCardWidth]);

  useEffect(() => {
    if(map) {
      handleMapboxMapEvent({ map, e: 'places_changed', dispatch, center, searchBoxPlacesBounds });
    }
  },[searchBoxPlacesBounds])

  useEffect(() => {
    let evtSubsc: { [id: string]: Array<Subscription> } = {};
    if (map && mapProvider === 'google') {
      evtSubsc = Object.keys(markerItem$).reduce((obj: { [id: string]: Array<Subscription> }, id) => {
        obj[id] = Object.keys(markerItem$[id]).map( e => {
          const marker = markersList.find( m => m.id === id )
          return markerItem$[id][e]
          .subscribe(() => marker? handleMapboxMarkerItemEvent({ map, e, dispatch, marker }):{})
        })
        return obj
      }
      , {});
    }
    return () => Object.keys(evtSubsc).forEach( id => evtSubsc[id].forEach(e$ => e$.unsubscribe()))
  },[markerItem$, markersList])

  const Markers = (mmap: mapboxgl.Map) =>
    markersList.map((m: AddMarkerToListInputType) => (
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
