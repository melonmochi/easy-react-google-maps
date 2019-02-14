import React, { FunctionComponent, useEffect, useContext, useRef, useState } from 'react';
import { gmMapEvents, boundsToGmbounds } from 'utils';
import { GlobalContext } from 'src/components/global-context';
import { Spin } from 'antd';
import { Marker, handleMapEvent } from 'gm';
import { AddMarkerToListInputType, Bounds } from 'typings';
import { fromEventPattern, merge, of } from 'rxjs';
import { filter } from 'rxjs/operators';

interface GoogleMapsMapProps {
  google: typeof google;
}

export const GoogleMapsMap: FunctionComponent<GoogleMapsMapProps> = props => {
  const { state, dispatch } = useContext(GlobalContext);
  const { mapProps, mapView, mapProvider, fitBounds, markersBounds, recenterMap } = state;
  const { center: defaultCenter } = mapProps;
  const { google } = props;

  const { gestureHandling, gmMaptype, gmMapEvtHandlers } = mapProps;

  const mapConfig: object = Object.assign(
    {},
    {
      center: { lat: mapView.center[0], lng: mapView.center[1] },
      gestureHandling,
      mapTypeId: gmMaptype, // optional main map layer. Terrain, satellite, hybrid or roadmap--if unspecified, defaults to roadmap.
      zoom: mapView.zoom, // sets zoom. Lower numbers are zoomed further out.
      mapTypeControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT,
      },
      fullscreenControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP,
      },
    }
  );

  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    if (mapProvider === 'google') {
      if (!map) {
        initMap();
      } else {
        map.setOptions({
          center: new google.maps.LatLng(mapView.center[0], mapView.center[1]),
          zoom: mapView.zoom,
        });
      }
    }
  }, [mapProvider]);

  const gmMapRef = useRef<HTMLDivElement>(null);

  const initMap = () => {
    const newMap = new google.maps.Map(gmMapRef.current, mapConfig);
    setEventStream(newMap);
    setMap(newMap);
  };

  const setEventStream = (m: google.maps.Map) => {
    const events$ = gmMapEvents.map(e => ({
      e: e,
      e$: fromEventPattern(
        handler => m.addListener(e, handler),
        (_handler, listener) => google.maps.event.removeListener(listener)
      ),
    }));
    merge(events$.map(s => s.e$.subscribe(handleMapEvent(m, s.e, dispatch, gmMapEvtHandlers))));
  };

  const fitGmBounds = (m: google.maps.Map, mb: Bounds) => {
    const gmBounds = boundsToGmbounds(mb);
    m.fitBounds(gmBounds);
    dispatch({ type: 'ON_FIT_BOUNDS' });
  };
  const recenterGmMap = (m: google.maps.Map) => {
    const c = defaultCenter ? defaultCenter : null;
    if (c) {
      m.panTo(new google.maps.LatLng(c[0], c[1]));
    } else {
      if (markersBounds) {
        const gmBounds = boundsToGmbounds(markersBounds);
        m.fitBounds(gmBounds);
      }
    }
    dispatch({ type: 'ON_RECENTER_MAP' });
  };

  of(fitBounds)
    .pipe(filter(() => fitBounds && mapProvider === 'google'))
    .subscribe(() => (markersBounds && map ? fitGmBounds(map, markersBounds) : {}));
  of(recenterMap)
    .pipe(filter(() => recenterMap && mapProvider === 'google'))
    .subscribe(() => (map ? recenterGmMap(map) : {}));

  const Markers = (gmap: google.maps.Map) =>
    state.markersList.map((m: AddMarkerToListInputType) => (
      <Marker key={m.id} id={m.id} map={gmap} props={m.props} />
    ));

  return (
    <div className="defaultContainer">
      <div className="defaultMap" ref={gmMapRef} />
      <Spin
        tip="Loading Map..."
        spinning={map ? false : true}
        size="large"
        style={{ width: 0, margin: 'auto', zIndex: 11 }}
      />
      {map ? Markers(map) : null}
    </div>
  );
};
