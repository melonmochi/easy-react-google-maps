import 'components/style';
import 'mapbox-gl/src/css/mapbox-gl.css';
import React, { FunctionComponent, useEffect, useContext, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { AddMarkerToListInputType, LatLng } from 'typings';
import { GlobalContext } from 'components';
import { Marker, handleMapEvent, handleMapTool } from 'mapbox';
import { Spin } from 'antd';
import { filter } from 'rxjs/operators';
import { fromEventPattern, Subscription, Observable } from 'rxjs';
import { mapboxConfig } from 'config';
import { mapboxMapEvents } from 'utils';

export const MapboxMap: FunctionComponent = () => {
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
    zoom,
  } = state;
  const { mapboxToken, mapboxStyle, mapboxMapEvtHandlers } = mapProps;
  mapboxgl.accessToken = mapboxToken ? mapboxToken : mapboxConfig.token;
  const mapConfig: object = Object.assign(
    {},
    {
      center: [center[1], center[0]],
      zoom: zoom - 1,
      style: mapboxStyle ? mapboxStyle : 'mapbox://styles/mapbox/streets-v9',
    }
  );

  const mapboxMapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [event$, setEvent$] = useState<Array<{ evt: string; e$: Observable<{}> }>>([]);

  const initMap = (node: HTMLDivElement) =>
    new mapboxgl.Map({
      container: node,
      doubleClickZoom: false,
      ...mapConfig,
    });

  const setEventStream = (m: mapboxgl.Map) =>
    mapboxMapEvents.map(e => ({
      evt: e,
      e$: fromEventPattern(handler => m.on(e, handler), handler => m.off(e, handler)),
    }));

  const Markers = (mmap: mapboxgl.Map) =>
    markersList.map((m: AddMarkerToListInputType) => (
      <Marker key={m.id} id={m.id} props={m.props} map={mmap} />
    ));

  const setMapView = (m: mapboxgl.Map, c: LatLng, z: number) => {
    m.jumpTo({ center: [c[1], c[0]], zoom: z - 1 }).resize();
  };

  useEffect(() => {
    let evtSubcrpts: Array<Subscription> = [];
    let mapToolSubcrpts: Array<Subscription> = [];
    if (mapboxMapRef.current) {
      if (!map) {
        const m = initMap(mapboxMapRef.current);
        setMap(m);
        setEvent$(setEventStream(m));
      } else {
        evtSubcrpts = event$.map(s => {
          return s.e$
            .pipe(filter(() => mapProvider === 'mapbox'))
            .subscribe(() => handleMapEvent({ map, evt: s.evt, dispatch, mapboxMapEvtHandlers }));
        });
        mapToolSubcrpts = Object.keys(mapTools$).map((tool: keyof typeof mapTools$) =>
          mapTools$[tool]
            .pipe(filter(() => mapProvider === 'mapbox'))
            .subscribe(() => handleMapTool({ map, tool, center, markersBounds }))
        );
        setMapView(map, mapView.center, mapView.zoom);
      }
    }
    return () => {
      evtSubcrpts.forEach(s => s.unsubscribe());
      mapToolSubcrpts.forEach(s => s.unsubscribe());
    };
  }, [mapProvider, mapCardWidth, event$, mapTools$, center, markersBounds]);

  return (
    <div className="defaultContainer">
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
