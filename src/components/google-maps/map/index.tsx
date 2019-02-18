import React, { FunctionComponent, useEffect, useContext, useRef, useState } from 'react';
import { AddMarkerToListInputType, LatLng } from 'typings';
import { GlobalContext } from 'src/components/global-context';
import { Observable, Subscription } from 'rxjs';
import { Spin } from 'antd';
import { filter } from 'rxjs/operators';
import { gmMapEvents } from 'utils';
import { loadMapStream, Marker, handleMapEvent, handleMapTool } from 'gm';

interface GoogleMapsMapProps {
  google: typeof google;
}

export const GoogleMapsMap: FunctionComponent<GoogleMapsMapProps> = props => {
  const { state, dispatch } = useContext(GlobalContext);
  const { center, mapProps, mapView, mapProvider, mapTools$, markersBounds, zoom } = state;
  const { google } = props;
  const { gestureHandling, gmMaptype, gmMapEvtHandlers } = mapProps;
  const mapConfig: object = Object.assign(
    {},
    {
      center: { lat: center[0], lng: center[1] },
      gestureHandling,
      mapTypeId: gmMaptype, // optional main map layer. Terrain, satellite, hybrid or roadmap--if unspecified, defaults to roadmap.
      zoom, // sets zoom. Lower numbers are zoomed further out.
      mapTypeControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT,
      },
      fullscreenControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP,
      },
    }
  );

  const gmMapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [event$, setEvent$] = useState<Array<{ evt: string; e$: Observable<{}> }>>([]);

  const initMap = () => new google.maps.Map(gmMapRef.current, mapConfig);

  const setEventStream = (m: google.maps.Map) =>
    gmMapEvents.map(e => ({
      evt: e,
      e$: loadMapStream(e, m),
    }));

  const Markers = (gmap: google.maps.Map) =>
    state.markersList.map((m: AddMarkerToListInputType) => (
      <Marker key={m.id} id={m.id} map={gmap} props={m.props} />
    ));

  const setMapView = (m: google.maps.Map, z: number, c: LatLng) => {
    m.setOptions({
      center: new google.maps.LatLng(c[0], c[1]),
      zoom: z,
    });
  };

  useEffect(() => {
    let evtSubcrpts: Array<Subscription> = [];
    let mapToolSubcrpts: Array<Subscription> = [];
    if (!map) {
      const m = initMap();
      setMap(m);
      setEvent$(setEventStream(m));
    } else {
      evtSubcrpts = event$.map(s =>
        s.e$
          .pipe(filter(() => mapProvider === 'google'))
          .subscribe(() => handleMapEvent({ map, evt: s.evt, dispatch, gmMapEvtHandlers }))
      );
      mapToolSubcrpts = Object.keys(mapTools$).map((tool: keyof typeof mapTools$) =>
        mapTools$[tool]
          .pipe(filter(() => mapProvider === 'google'))
          .subscribe(() => handleMapTool({ map, tool, center, markersBounds }))
      );
      setMapView(map, mapView.zoom, mapView.center);
    }
    return () => {
      evtSubcrpts.forEach(s => s.unsubscribe());
      mapToolSubcrpts.forEach(t => t.unsubscribe());
    };
  }, [mapProvider, event$, mapTools$, center, markersBounds]);

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
