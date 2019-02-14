import React, { FunctionComponent, useEffect, useContext, useRef, useState } from 'react';
import { GlobalContext } from 'components';
import { mapboxConfig } from 'config';
import mapboxgl from 'mapbox-gl';
import { Spin } from 'antd';
import { AddMarkerToListInputType, Bounds } from 'typings';
import { Marker, handleMapEvent } from 'mapbox';
import { mapboxMapEventsNew } from 'utils';
import 'mapbox-gl/src/css/mapbox-gl.css';
import 'components/style';
import { fromEventPattern, merge, of } from 'rxjs';
import { filter, take } from 'rxjs/operators';

export const MapboxMap: FunctionComponent = () => {
  const { state, dispatch } = useContext(GlobalContext);
  const {
    markersList,
    mapProps,
    mapView,
    fitBounds,
    mapProvider,
    mapCardWidth,
    markersBounds,
  } = state;

  const { mapboxToken, mapboxStyle, mapboxMapEvtHandlers } = mapProps;

  mapboxgl.accessToken = mapboxToken ? mapboxToken : mapboxConfig.token;

  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (mapProvider === 'mapbox') {
      if (!map) {
        initMap();
      } else {
        map
          .jumpTo({
            center: [mapView.center[1], mapView.center[0]],
            zoom: mapView.zoom - 1,
          })
          .resize();
      }
    }
  }, [mapProvider, mapCardWidth]);

  const mapConfig: object = Object.assign(
    {},
    {
      center: new mapboxgl.LngLat(mapView.center[1], mapView.center[0]),
      zoom: mapView.zoom - 1,
      style: mapboxStyle ? mapboxStyle : 'mapbox://styles/mapbox/streets-v9',
    }
  );

  const mapboxMapRef = useRef<HTMLDivElement>(null);

  const initMap = () => {
    if (mapboxMapRef && mapboxMapRef.current) {
      const newMap = new mapboxgl.Map({
        container: mapboxMapRef.current,
        ...mapConfig,
      });
      setMap(newMap);
      setEventStream(newMap);
    }
  };

  const setEventStream = (m: mapboxgl.Map) => {
    const events$ = mapboxMapEventsNew.map(e => ({
      e: e,
      e$: fromEventPattern(handler => m.on(e, handler), handler => m.off(e, handler)),
    }));
    merge(events$.map(s => s.e$.subscribe(handleMapEvent(m, s.e, dispatch, mapboxMapEvtHandlers))));
  };

  const fitMapboxBounds = (m: mapboxgl.Map, mb: Bounds) => {
    const swMapbox = [mb[0][1], mb[0][0]];
    const neMapbox = [mb[1][1], mb[1][0]];
    m.fitBounds([swMapbox, neMapbox] as Bounds, { linear: true });
    dispatch({ type: 'ON_FIT_BOUNDS' });
    fromEventPattern(handler => m.on('moveend', handler), handler => m.off('moveend', handler))
      .pipe(take(1))
      .subscribe(() => (map ? map.jumpTo({ zoom: Math.floor(map.getZoom()) }) : {}));
  };

  of(fitBounds)
    .pipe(filter(() => fitBounds && mapProvider === 'mapbox'))
    .subscribe(() => (map && markersBounds ? fitMapboxBounds(map, markersBounds) : {}));

  const Markers = (mmap: mapboxgl.Map) =>
    markersList.map((m: AddMarkerToListInputType) => <Marker key={m.id} map={mmap} {...m.props} />);

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
