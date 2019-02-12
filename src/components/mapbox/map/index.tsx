import React, { FunctionComponent, useEffect, useContext, useRef } from 'react'
import { GlobalContext } from 'components';
import { mapboxConfig } from 'config'
import mapboxgl from 'mapbox-gl'
import { Spin } from 'antd';
import { AddMarkerToListInputType } from 'typings';
import { Marker, handleMapEvent } from 'mapbox';
import { mapboxMapEvents } from 'utils';
import 'mapbox-gl/src/css/mapbox-gl.css';
import 'components/style'

export const MapboxMap: FunctionComponent = () => {
  const { state, dispatch } = useContext(GlobalContext)
  const { mapboxMap, markersList, mapProps, mapCardWidth, mapProvider } = state

  const { mapboxToken,  mapboxStyle, mapboxMapEvtHandlers } = mapProps

  mapboxgl.accessToken = mapboxToken? mapboxToken: mapboxConfig.token

  useEffect(() => {
    if(!mapboxMap){
      initMap();
    } else {
      dispatch({type:'RESIZE_MAPBOX_MAP'})
    }
    return clearMap
  }, [ mapProvider, mapCardWidth ])

  const mapConfig: object = Object.assign(
    {},
    {
      center: new mapboxgl.LngLat(state.currentCenter[1], state.currentCenter[0]),
      zoom: state.zoom - 1,
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
      addMapListeners(newMap)
    }
  }

  const addMapListeners = (m: mapboxgl.Map) => {
    mapboxMapEvents.forEach(e => {
      m.on(e, handleMapEvent(m, e, dispatch, mapboxMapEvtHandlers));
    });
  };

  const clearMap = () => {
    if(mapboxMap) {
      removeMapListeners(mapboxMap)
    }
  };

  const removeMapListeners = (m: mapboxgl.Map) => {
    mapboxMapEvents.forEach(e => {
      m.off(e, handleMapEvent(m, e, dispatch, mapboxMapEvtHandlers))
    })
  };

  const Markers = (mmap: mapboxgl.Map) => markersList.map(
    (m: AddMarkerToListInputType) => <Marker key={m.id} map={mmap} {...m.props} />
  )

  return (
    <div className='defaultContainer'>
      <div className='defaultMap' ref={mapboxMapRef} />
      <Spin
        tip="Loading Map..."
        spinning={!mapboxMap}
        size="large"
        style={{ width: "auto", margin: "auto", zIndex: 11 }}
      />
      {mapboxMap ? Markers(mapboxMap) : null}
    </div>
  )
}
