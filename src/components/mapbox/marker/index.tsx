import React, { FunctionComponent, useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { MarkerEvents, camelCase } from 'utils';
import { AllInOneMarkerProps, MarkerEvtHandlersType } from 'typings';
import './style'
import { Tooltip } from 'antd';

interface MapboxMarkerProps extends AllInOneMarkerProps {
  map: mapboxgl.Map;
}

export const Marker: FunctionComponent<MapboxMarkerProps> = (props) => {

  const {
    map,
    draggable,
  }= props

  const markerOpt = {
    color: '#0c4842',
    draggable,
  };

  const [marker, setMarker] = useState<mapboxgl.Marker | undefined>(undefined)

  const el = useRef<HTMLDivElement>(null)

  useEffect(() => {
    renderMarker()
    return () => {
      clearMarker()
    }
  }, [props])

  const renderMarker = () => {
    if (map) {
      if (el && el.current) {
        const newMarker = new mapboxgl.Marker(el.current,
          markerOpt
        )
        .setLngLat([props.position[1], props.position[0]])
        .addTo(map);
        setMarker(newMarker)
        addMarkerListeners(el.current, newMarker)
      }
    }
  }

  const addMarkerListeners = (div: HTMLDivElement, mar: mapboxgl.Marker) => {
    MarkerEvents.forEach(e => {
      div.addEventListener(e, handleMarkerEvent(mar, e, props.markerEvtHandlers));
    });
  }

  const handleMarkerEvent = (m: mapboxgl.Marker, evt: string, markerEvtHandlers?: MarkerEvtHandlersType | any) => {
    return (e: Event) => {
      const evtName = `on${camelCase(evt)}`;
      if (markerEvtHandlers && markerEvtHandlers[evtName]) {
        markerEvtHandlers[evtName](marker)

      } else {
        defaultMapboxMarkerEventHandler(evtName, e, m);
      }
    };
  };

  const [ hover, setHover ] = useState<boolean>(false)

  const defaultMapboxMarkerEventHandler = (
    evtName: string,
    _e: Event,
    _marker: mapboxgl.Marker
  ) => {
    switch (evtName) {
      case 'onMouseover':
        setHover(true)
        break;
      case 'onMouseout':
        setHover(false)
        break;
      case 'onClick':
        break;
      case 'onDblclick':
        break;
      case 'onRightclick':
        break;
      case 'onDrag':
      case 'onDragend':
      default:
      // throw new Error('No corresponding event')
    }
  }

  const clearMarker = () => {
    if(marker) {
      marker.remove();
    }
  }

  return (
    <div>
      <Tooltip title={props.title} mouseLeaveDelay={0}>
        <div ref={el} className={hover? 'bigMarker':'marker'} />
      </Tooltip>
    </div>
  )
}
