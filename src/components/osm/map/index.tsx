import 'components/style';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import React, { FunctionComponent, useEffect, useContext, useRef, useState } from 'react';
import icon from 'src/assets/images/marker-icon.png';
import iconShadow from 'src/assets/images/marker-shadow.png';
import { AddMarkerToListInputType, Bounds } from 'typings';
import { GlobalContext } from 'components';
import { Marker, handleMapEvent } from 'osm';
import { Spin } from 'antd';
import { filter } from 'rxjs/operators';
import { fromEventPattern, merge, of } from 'rxjs';
import { osmMapEvents } from 'utils';

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
    fitBounds,
    mapCardWidth,
    mapProps,
    mapProvider,
    mapView,
    markersBounds,
    markersList,
    recenterMap,
  } = state;
  const { center: defaultCenter } = mapProps;
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
    const events$ = osmMapEvents.map(e => ({
      e: e,
      e$: fromEventPattern(handler => m.on(e, handler), handler => m.off(e, handler)),
    }));
    merge(events$.map(s => s.e$.subscribe(handleMapEvent(m, s.e, dispatch, osmMapEvtHandlers))));
  };

  const fitOSMBounds = (m: L.Map, mb: Bounds) => {
    m.fitBounds(mb);
    dispatch({ type: 'ON_FIT_BOUNDS' });
  };
  const recenterOSMMap = (m: L.Map) => {
    const c = defaultCenter ? defaultCenter : null;
    if (c) {
      m.panTo(c);
    } else {
      if (markersBounds) {
        m.fitBounds(markersBounds);
      }
    }
    dispatch({ type: 'ON_RECENTER_MAP' });
  };

  of(fitBounds)
    .pipe(filter(() => fitBounds && mapProvider === 'osm'))
    .subscribe(() => (markersBounds && map ? fitOSMBounds(map, markersBounds) : {}));
  of(recenterMap)
    .pipe(filter(() => recenterMap && mapProvider === 'osm'))
    .subscribe(() => (map ? recenterOSMMap(map) : {}));

  const Markers = (omap: L.Map) =>
    markersList.map((m: AddMarkerToListInputType) => (
      <Marker key={m.id} id={m.id} map={omap} props={m.props} />
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
