import React, { FunctionComponent, useEffect, useContext, useRef } from 'react'
import { GlobalContext } from 'src/components/global-context';
import { mapboxConfig } from 'config'
import mapboxgl from 'mapbox-gl'
import 'components/style'
import 'mapbox-gl/src/css/mapbox-gl.css'
import { Spin } from 'antd';
import { AddMarkerToListInputType } from 'typings';
import { Marker } from 'mapbox';

export const MapboxMap: FunctionComponent = () => {

  const { state, dispatch } = useContext(GlobalContext)
  const { markersList, mapProps, mapboxMap, mapCardWidth, mapProvider, zoom } = state

  const { mapboxToken,  mapboxStyle } = mapProps

  mapboxgl.accessToken = mapboxToken? mapboxToken: mapboxConfig.token

  useEffect(() => {
    if(!mapboxMap){
      initMap();
    } else {
      if(mapboxMap.getZoom() !== zoom) {
        mapboxMap.setZoom(zoom)
      }
      mapboxMap.resize()
    }
  }, [mapCardWidth, mapProvider, markersList, zoom])

  const mapConfig: object = Object.assign(
    {},
    {
      center: new mapboxgl.LngLat(state.center[1], state.center[0]),
      zoom: state.zoom,
      style: mapboxStyle ? mapboxStyle : 'mapbox://styles/mapbox/streets-v9',
    }
  );

  const mapboxMapRef = useRef<HTMLDivElement>(null)

  const initMap = () => {
    if (mapboxMapRef && mapboxMapRef.current) {
      const newMap = new mapboxgl.Map({
        container: mapboxMapRef.current,
        ...mapConfig,
      })
      dispatch({type: 'SET_MAPBOX_MAP', payload: newMap})
    }
  }

  const Markers = (map: mapboxgl.Map) => markersList.map(
    (m: AddMarkerToListInputType) => <Marker key={m.id} map={map} {...m.props} />
  )

  return (
    <div className='defaultContainer'>
      <div className='defaultMap' ref={mapboxMapRef} />
      <Spin
        tip="Loading Map..."
        spinning={false}
        size="large"
        style={{ width: "auto", marginTop: "auto", marginBottom: "auto", zIndex: 11 }}
      />
      {mapboxMap ? Markers(mapboxMap) : null}
    </div>
  )
}
