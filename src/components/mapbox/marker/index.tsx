import './style';
import React, { FunctionComponent, useState, useEffect, useRef, useContext } from 'react';
import mapboxgl from 'mapbox-gl';
import { AllInOneMarkerProps } from 'typings';
import { GlobalContext } from 'src/components/global-context';
import { Tooltip } from 'antd';
import { fromEventPattern, merge } from 'rxjs';
import { handleMarkerEvt } from 'mapbox';
import { mapboxMarkerEvents } from 'utils';
import { filter } from 'rxjs/operators';

interface MapboxMarkerProps {
  map: mapboxgl.Map;
  id: string;
  props: AllInOneMarkerProps;
}

export const Marker: FunctionComponent<MapboxMarkerProps> = props => {
  const { map, id, props: mProps } = props;
  const { draggable, position, title, markerEvtHandlers } = mProps;

  const markerOpt = {
    color: '#0c4842',
    draggable,
  };

  const { state, dispatch } = useContext(GlobalContext);
  const { mapProvider } = state;
  const [marker, setMarker] = useState<mapboxgl.Marker | undefined>(undefined);
  const [hover, setHover] = useState<boolean>(false);
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!marker) {
      renderMarker();
    } else {
      marker.setLngLat([position[1], position[0]]);
    }
  }, [position]);

  const renderMarker = () => {
    if (map) {
      if (el && el.current) {
        const newMarker = new mapboxgl.Marker(el.current, markerOpt)
          .setLngLat([position[1], position[0]])
          .addTo(map);
        setMarker(newMarker);
        setEventStream(newMarker);
      }
    }
  };

  const setEventStream = (m: mapboxgl.Marker) => {
    const events$ = mapboxMarkerEvents.map(e => ({
      e: e,
      e$: fromEventPattern(handler => m.on(e, handler), handler => m.off(e, handler)),
    }));
    merge(
      events$.map(s =>
        s.e$
          .pipe(filter(() => mapProvider === 'mapbox'))
          .subscribe(handleMarkerEvt(s.e, id, m, dispatch, markerEvtHandlers))
      )
    );
  };

  const handleOnHover = (h: boolean) => {
    setHover(h);
  };

  return (
    <div>
      <Tooltip title={title} mouseLeaveDelay={0} onVisibleChange={handleOnHover}>
        <div ref={el} className={hover ? 'bigMarker' : 'marker'} />
      </Tooltip>
    </div>
  );
};
