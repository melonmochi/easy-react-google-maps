import React, { FunctionComponent, useEffect, useContext, useRef, useState } from 'react';
import { AddMarkerToListInputType, EvtStreamType } from 'typings';
import { GlobalContext } from 'src/components/global-context';
import { Subscription } from 'rxjs';
import { Spin } from 'antd';
import { setGmMapConfig, handleGmMapEvent, setMapView, Marker, combineEventStreams } from 'gm';

interface GoogleMapsMapProps {
  google: typeof google;
}

export const GoogleMapsMap: FunctionComponent<GoogleMapsMapProps> = props => {
  const { state, dispatch } = useContext(GlobalContext);
  const { center, mapProps, mapView, mapProvider, mapTools$, markersBounds, zoom, searchBoxPlacesBounds } = state;
  const { google } = props;
  const { gestureHandling, gmMaptype } = mapProps;
  const mapConfig = setGmMapConfig({ center, zoom, gestureHandling, gmMaptype });
  const gmMapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [gmEvents$, setGmEvents$] = useState<EvtStreamType>({});

  useEffect(() => {
    const m = new google.maps.Map(gmMapRef.current, mapConfig);
    setMap(m);
    setGmEvents$(combineEventStreams(m, mapTools$));
  }, []);

  useEffect(() => {
    if (map) {
      setGmEvents$(combineEventStreams(map, mapTools$));
    }
  }, [mapTools$]);

  useEffect(() => {
    if(map) {
      handleGmMapEvent({ map, e: 'places_changed', dispatch, center, searchBoxPlacesBounds });
    }
  },[searchBoxPlacesBounds])

  useEffect(() => {
    let evtSubsc: Array<Subscription> = [];
    if (map && mapProvider === 'google') {
      setMapView(map, mapView.zoom, mapView.center);
      evtSubsc = Object.keys(gmEvents$).map(e =>
        gmEvents$[e].subscribe(() => handleGmMapEvent({ map, e, dispatch, center, searchBoxPlacesBounds }))
      );
    }
    return () => evtSubsc.forEach(s => s.unsubscribe());
  }, [mapProvider, gmEvents$, center, markersBounds]);

  const MapChildComponents = (m: google.maps.Map) => Markers(m)

  const Markers = (gmap: google.maps.Map) =>
    state.markersList.map((m: AddMarkerToListInputType) => (
      <Marker key={m.id} id={m.id} map={gmap} props={m.props} />
    ));

  return (
    <div
      className="defaultContainer"
      style={{ visibility: mapProvider === 'google' ? 'visible' : 'hidden' }}
    >
      <div className="defaultMap" ref={gmMapRef} />
      <Spin
        tip="Loading Map..."
        spinning={map ? false : true}
        size="large"
        style={{ width: 0, margin: 'auto', zIndex: 11 }}
      />
      {map ? MapChildComponents(map) : null}
    </div>
  );
};
