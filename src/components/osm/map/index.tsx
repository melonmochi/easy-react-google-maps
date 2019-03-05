import 'components/style';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import React, { FunctionComponent, useEffect, useContext, useRef, useState } from 'react';
import greenIconURL from 'assets/images/marker-green.svg';
import { AddMarkerToListInputType, EvtStreamType } from 'typings';
import { GlobalContext } from 'components';
import {
  Marker,
  setMapView,
  combineEventStreams,
  setOsmMapConfig,
  handleOsmMapEvent,
} from 'osm';
import { Spin } from 'antd';
import { Subscription } from 'rxjs';

export const osmGreenIcon = L.icon({
  iconUrl: greenIconURL,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});
L.Marker.prototype.options.icon = osmGreenIcon;

export const OSMMap: FunctionComponent = () => {
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
    osmMarkerClusterer,
    searchBoxPlacesBounds,
    updateView,
    zoom,
  } = state;
  const { osmTileLayerServer } = mapProps;
  const mapConfig = setOsmMapConfig({ center, zoom, osmTileLayerServer });
  const osmMapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [osmEvents$, setOsmEvents$] = useState<EvtStreamType>({});
  const previousZoom = usePreviousZoom(mapView.zoom);

  const initMap = (node: HTMLDivElement) => L.map(node, mapConfig);

  useEffect(() => {
    if (osmMapRef.current) {
      const m = initMap(osmMapRef.current);
      setMap(m);
      m.addLayer(osmMarkerClusterer);
      setOsmEvents$(combineEventStreams(m, mapTools$));
    }
  }, []);

  useEffect(() => {
    if (map) {
      setOsmEvents$(combineEventStreams(map, mapTools$));
    }
  }, [mapTools$]);

  useEffect(() => {
    let evtSubsc: Array<Subscription> = [];
    if (map && mapProvider === 'osm') {
      setMapView(map, mapView.center, mapView.zoom);
      evtSubsc = Object.keys(osmEvents$).map(e =>
        osmEvents$[e].subscribe(() =>
          handleOsmMapEvent({ map, e, dispatch, center, markersBounds })
        )
      );
    }
    return () => evtSubsc.forEach(s => s.unsubscribe());
  }, [mapProvider, osmEvents$, center, markersBounds]);

  useEffect(() => {
    if (map && mapProvider === 'osm') {
      map.invalidateSize();
    }
  }, [mapCardWidth]);

  useEffect(() => {
    if (map) {
      handleOsmMapEvent({ map, e: 'places_changed', dispatch, center, searchBoxPlacesBounds });
    }
  }, [searchBoxPlacesBounds]);

  useEffect(() => {
    if (previousZoom && mapProvider === 'osm') {
      if (mapView.zoom > previousZoom) {
        dispatch({ type: 'UPDATE_ICON' });
      }
    }
  }, [mapView.zoom]);

  useEffect(() => {
    if(map && mapProvider === 'osm') {
      setMapView(map, mapView.center, mapView.zoom );
      dispatch({ type: 'UPDATE_ICON' });
    }
  }, [updateView])

  const Markers = (omap: L.Map) =>
    markersList.map((m: AddMarkerToListInputType) => (
      <Marker key={m.id} id={m.id} map={omap} props={m.props} />
    ));

  return (
    <div
      className="defaultContainer"
      style={{ visibility: mapProvider === 'osm' ? 'visible' : 'hidden' }}
    >
      <div className="defaultMap" ref={osmMapRef} />
      <Spin
        tip="Loading Map..."
        spinning={!map}
        size="large"
        style={{ width: 0, marginTop: 'auto', marginBottom: 'auto', zIndex: 11 }}
      />
      {map ? Markers(map) : null}
    </div>
  );
};

const usePreviousZoom = (z: number) => {
  const ref = useRef<number>();
  useEffect(() => {
    ref.current = z;
  });
  return ref.current;
};
