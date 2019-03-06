import React, { FunctionComponent, useEffect, useContext, useRef, useState } from 'react';
import { EvtStreamType, AddMarkerToListInputType } from 'typings';
import { GlobalContext } from 'src/components/global-context';
import { Subscription } from 'rxjs';
import { Spin } from 'antd';
import { setGmMapConfig, handleGmMapEvent, setMapView, combineEventStreams, Marker } from 'gm';

interface GoogleMapsMapProps {
  google: typeof google;
}

export const GoogleMapsMap: FunctionComponent<GoogleMapsMapProps> = props => {
  const { state, dispatch } = useContext(GlobalContext);
  const {
    center,
    mapProps,
    mapView,
    mapProvider,
    mapTools$,
    markersBounds,
    markersList,
    zoom,
    searchBoxPlacesBounds,
    updateView,
  } = state;
  const { google } = props;
  const { gestureHandling, gmMaptype } = mapProps;
  const mapConfig = setGmMapConfig({ center, zoom, gestureHandling, gmMaptype });
  const gmMapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [gmEvents$, setGmEvents$] = useState<EvtStreamType>({});

  useEffect(() => {
    const m = new google.maps.Map(gmMapRef.current, mapConfig);
    setMap(m);
    dispatch({ type: 'SET_GM_MARKER_CLUSTERER', payload: m });
    setGmEvents$(combineEventStreams(m, mapTools$));
  }, []);

  useEffect(() => {
    if (map) {
      setGmEvents$(combineEventStreams(map, mapTools$));
    }
  }, [mapTools$]);

  useEffect(() => {
    if (map) {
      handleGmMapEvent({ map, e: 'places_changed', dispatch, center, searchBoxPlacesBounds });
    }
  }, [searchBoxPlacesBounds]);

  useEffect(() => {
    let evtSubsc: Array<Subscription> = [];
    if (map && mapProvider === 'google') {
      setMapView(map, mapView.zoom, mapView.center);
      evtSubsc = Object.keys(gmEvents$).map(e =>
        gmEvents$[e].subscribe(() =>
          handleGmMapEvent({ map, e, dispatch, center, markersBounds, searchBoxPlacesBounds })
        )
      );
    }
    return () => {
      evtSubsc.forEach(s => s.unsubscribe());
    };
  }, [mapProvider, gmEvents$, center, markersBounds]);

  useEffect(() => {
    if (map && mapProvider === 'google') {
      setMapView(map, mapView.zoom, mapView.center);
    }
  }, [updateView]);

  const Markers = (gmap: google.maps.Map) =>
    markersList
      .filter(m => !m.hide)
      .map((m: AddMarkerToListInputType) => (
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
      {map ? Markers(map) : null}
    </div>
  );
};
