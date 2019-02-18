import 'components/style';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import React, { FunctionComponent, useEffect, useContext, useRef, useState } from 'react';
import greenIconURL from 'assets/images/marker-green.svg';
import { AddMarkerToListInputType, LatLng } from 'typings';
import { GlobalContext } from 'components';
import { Marker, handleMapEvent, handleMapTool } from 'osm';
import { Spin } from 'antd';
import { fromEventPattern, Observable, Subscription } from 'rxjs';
import { osmMapEvents } from 'utils';
import { filter } from 'rxjs/operators';

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
    zoom,
  } = state;
  const { osmTileLayerServer, osmMapEvtHandlers } = mapProps;
  const mapConfig: object = Object.assign(
    {},
    {
      center,
      zoom,
      layers: [
        new L.TileLayer(
          osmTileLayerServer ? osmTileLayerServer : 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        ),
      ],
    }
  );

  const osmMapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [event$, setEvent$] = useState<Array<{ evt: string; e$: Observable<{}> }>>([]);

  const initMap = (node: HTMLDivElement) => L.map(node, mapConfig);

  const setEventStream = (m: L.Map) =>
    osmMapEvents.map(e => ({
      evt: e,
      e$: fromEventPattern(handler => m.on(e, handler), handler => m.off(e, handler)),
    }));

  const Markers = (omap: L.Map) =>
    markersList.map((m: AddMarkerToListInputType) => (
      <Marker key={m.id} id={m.id} map={omap} props={m.props} />
    ));

  const setMapView = (m: L.Map, c: LatLng, z: number) => {
    m.setView(c, z).invalidateSize();
  };

  useEffect(() => {
    const subscriptions: Array<Subscription> = [];
    if (osmMapRef.current) {
      if (!map) {
        const m = initMap(osmMapRef.current);
        setMap(m);
        setEvent$(setEventStream(m));
      } else {
        subscriptions
          .concat(
            event$.map(s =>
              s.e$
                .pipe(filter(() => mapProvider === 'osm'))
                .subscribe(() => handleMapEvent({ map, evt: s.evt, dispatch, osmMapEvtHandlers }))
            )
          )
          .concat(
            Object.keys(mapTools$).map((tool: keyof typeof mapTools$) =>
              mapTools$[tool]
                .pipe(filter(() => mapProvider === 'osm'))
                .subscribe(() => handleMapTool({ map, tool, center, markersBounds }))
            )
          );
        setMapView(map, mapView.center, mapView.zoom);
      }
    }
    return () => subscriptions.forEach(s => s.unsubscribe());
  }, [mapProvider, mapCardWidth, event$, mapTools$, center, markersBounds]);

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
