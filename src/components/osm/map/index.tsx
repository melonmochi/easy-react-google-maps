import React, { FunctionComponent, useEffect, useContext, useRef, useState } from 'react';
import L from 'leaflet';
import icon from 'src/assets/images/marker-icon.png';
import iconShadow from 'src/assets/images/marker-shadow.png';
import { GlobalContext } from 'components';
import { Spin } from 'antd';
import { Marker, handleMapEvent } from 'osm';
import { AddMarkerToListInputType, Bounds } from 'typings';
import { osmMapEventsNew } from 'utils';
import 'leaflet/dist/leaflet.css';
import 'components/style';
import { fromEventPattern, merge, of } from 'rxjs';
import { filter } from 'rxjs/operators';

const DefaultIcon = L.icon({
  iconUrl: icon,
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

export const OSMMap: FunctionComponent = () => {
  const { state, dispatch } = useContext(GlobalContext);
  const {
    markersList,
    mapProps,
    mapProvider,
    mapView,
    mapCardWidth,
    fitBounds,
    markersBounds,
  } = state;
  const { osmTileLayerServer, osmMapEvtHandlers } = mapProps;

  const mapConfig: object = Object.assign(
    {},
    {
      center: mapView.center,
      zoom: mapView.zoom,
      layers: [
        new L.TileLayer(
          osmTileLayerServer ? osmTileLayerServer : 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        ),
      ],
    }
  );

  const [map, setMap] = useState<L.Map | null>(null);

  useEffect(() => {
    if (mapProvider === 'osm') {
      if (!map) {
        initMap();
      } else {
        map.setView(mapView.center, mapView.zoom).invalidateSize();
      }
    }
  }, [mapProvider, mapCardWidth]);

  const osmMapRef = useRef<HTMLDivElement>(null);

  const initMap = () => {
    if (osmMapRef.current) {
      const newMap = L.map(osmMapRef.current, mapConfig);
      setMap(newMap);
      setEventStream(newMap);
    }
  };

  const setEventStream = (m: L.Map) => {
    const events$ = osmMapEventsNew.map(e => ({
      e: e,
      e$: fromEventPattern(handler => m.on(e, handler), handler => m.off(e, handler)),
    }));
    merge(events$.map(s => s.e$.subscribe(handleMapEvent(m, s.e, dispatch, osmMapEvtHandlers))));
  };

  const fitOSMBounds = (m: L.Map, mb: Bounds) => {
    m.fitBounds(mb);
    dispatch({ type: 'ON_FIT_BOUNDS' });
  };

  of(fitBounds)
    .pipe(filter(() => fitBounds && mapProvider === 'osm'))
    .subscribe(() => (markersBounds && map ? fitOSMBounds(map, markersBounds) : {}));

  const Markers = (omap: L.Map) =>
    markersList.map((m: AddMarkerToListInputType) => (
      <Marker key={m.id} id={m.id} map={omap} {...m.props} />
    ));

  return (
    <div className="defaultContainer">
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
