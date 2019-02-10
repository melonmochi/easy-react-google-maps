import React, { FunctionComponent, useEffect, useContext, useRef } from 'react';
import L from 'leaflet';
import 'components/style'
import 'leaflet/dist/leaflet.css'

import icon from 'src/assets/images/marker-icon.png';
import iconShadow from 'src/assets/images/marker-shadow.png';
import { GlobalContext } from 'components';
import { Spin } from 'antd';
import { Marker } from 'osm';
import { AddMarkerToListInputType} from 'typings';

const DefaultIcon = L.icon({
    iconUrl: icon,
    iconSize: [25,41],
    iconAnchor: [12.5,41],
    shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

export const OSMMap: FunctionComponent = () => {

  const { state, dispatch } = useContext(GlobalContext)
  const {
    osmMap, markersList, mapProps, mapProvider,
    mapCardWidth, zoom, currentCenter,
  } = state

  const { osmTileLayerServer } = mapProps

  const mapConfig: object = Object.assign(
    {},
    {
      center: [state.center[0], state.center[1]],
      zoom: state.zoom,
      layers: [new L.TileLayer(osmTileLayerServer? osmTileLayerServer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png')],
    }
  );

  useEffect(() => {
    if(!osmMap) {
      initMap();
    } else {
      if(osmMap.getZoom() !== zoom) {
        osmMap.setZoom(zoom)
      }
      if(osmMap.getCenter() !== new L.LatLng(currentCenter[0], currentCenter[1])) {
        osmMap.panTo(currentCenter)
      }
      osmMap.invalidateSize()
    }
  }, [mapCardWidth, mapProvider, markersList, osmMap, zoom, currentCenter])

  const osmMapRef = useRef<HTMLDivElement>(null)

  const initMap = () => {
    if(osmMapRef.current) {
      const newMap = L.map(osmMapRef.current,mapConfig)
      dispatch({type: 'SET_OSM_MAP', payload: newMap})
    }
  }

  const Markers = (map: L.Map) => markersList
    .map((m: AddMarkerToListInputType) => <Marker key={m.id} id={m.id} map={map} {...m.props}/>)

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
