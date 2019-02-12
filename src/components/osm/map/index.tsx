import React, { FunctionComponent, useEffect, useContext, useRef } from 'react';
import L from 'leaflet';
import icon from 'src/assets/images/marker-icon.png';
import iconShadow from 'src/assets/images/marker-shadow.png';
import { GlobalContext } from 'components';
import { Spin } from 'antd';
import { Marker, handleMapEvent } from 'osm';
import { AddMarkerToListInputType } from 'typings';
import { osmMapEvents } from 'utils';
import 'leaflet/dist/leaflet.css'
import 'components/style'

const DefaultIcon = L.icon({
  iconUrl: icon,
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

export const OSMMap: FunctionComponent = () => {
  const { state, dispatch } = useContext(GlobalContext)
  const {
    osmMap, markersList, mapProps,
    zoom, mapCardWidth, currentCenter,
    mapProvider,
  } = state
  const { osmTileLayerServer, osmMapEvtHandlers } = mapProps

  const mapConfig: object = Object.assign(
    {},
    {
      center: [currentCenter[0], currentCenter[1]],
      zoom,
      layers: [new L.TileLayer(osmTileLayerServer ? osmTileLayerServer : 'http://{s}.tile.osm.org/{z}/{x}/{y}.png')],
    }
  );

  useEffect(() => {
    if (!osmMap) {
      initMap();
    } else {
      dispatch({type:'RESIZE_OSM_MAP'})
    }
    return () => {
      clearMap();
    };
  }, [mapCardWidth, mapProvider])

  const osmMapRef = useRef<HTMLDivElement>(null)

  const initMap = () => {
    if (osmMapRef.current) {
      const newMap = L.map(osmMapRef.current, mapConfig)
      dispatch({ type: 'SET_OSM_MAP', payload: newMap })
      addMapListeners(newMap)
    }
  }

  const addMapListeners = (m: L.Map) => {
    osmMapEvents.forEach(e => {
      m.on(e, handleMapEvent(m, e, dispatch, osmMapEvtHandlers));
    });
  };

  const clearMap = () => {
    if (osmMap) {
      removeMapListeners(osmMap);
    }
  };

  const removeMapListeners = (m: L.Map) => {
    osmMapEvents.forEach(e => {
      m.off(e, handleMapEvent(m, e, dispatch, osmMapEvtHandlers))
    })
  };

  const Markers = (omap: L.Map) => markersList
    .map((m: AddMarkerToListInputType) => <Marker key={m.id} id={m.id} map={omap} {...m.props} />)

  return (
    <div className='defaultContainer'>
      <div className='defaultMap' ref={osmMapRef} />
      <Spin
        tip="Loading Map..."
        spinning={false}
        size="large"
        style={{ width: "auto", marginTop: "auto", marginBottom: "auto", zIndex: 11 }}
      />
      {osmMap ? Markers(osmMap) : null}
    </div>
  )
}
