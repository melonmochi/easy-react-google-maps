import './style';
import React, { FunctionComponent, useState, useEffect, useRef, useContext } from 'react';
import mapboxgl from 'mapbox-gl';
import { Subscription } from 'rxjs';
import { AllInOneMarkerProps, EvtStreamType } from 'typings';
import { GlobalContext } from 'src/components/global-context';
import { Tooltip } from 'antd';
import { ifSelected } from 'utils';
import {
  loadMarpboxMarkerEventsStream,
  setMapboxMarkerConfig,
  handleMapboxMarkerEvent,
} from 'mapbox';

interface MapboxMarkerProps {
  map: mapboxgl.Map;
  id: string;
  props: AllInOneMarkerProps;
}

export const Marker: FunctionComponent<MapboxMarkerProps> = props => {
  const { map, id, props: mProps } = props;
  const { draggable, position, title, color } = mProps;
  const markerOpt = setMapboxMarkerConfig({ title, color, draggable, position });
  const { state, dispatch } = useContext(GlobalContext);
  const { selectedMarker } = state;
  const [markerStyle, setMarkerStyle] = useState<'greenMarker' | 'blueBigMarker' | 'redBigMarker'>(
    'greenMarker'
  );
  const el = useRef<HTMLDivElement>(null);

  const [marker, setMarker] = useState<mapboxgl.Marker | undefined>(undefined);
  const [mapboxMarkerEvents$, setMapboxMarkerEvents$] = useState<EvtStreamType>({});

  const createMarker = (node: HTMLDivElement) =>
    new mapboxgl.Marker(node, markerOpt.opt).setLngLat(markerOpt.position).addTo(map);

  useEffect(() => {
    if (el.current) {
      const m = createMarker(el.current);
      setMarker(m);
      setMapboxMarkerEvents$(loadMarpboxMarkerEventsStream(m, el.current));
    }
  }, []);

  useEffect(() => {
    let markerEvtSubsc: Array<Subscription> = [];
    if (marker) {
      const ifselected = ifSelected(id, selectedMarker);
      ifselected ? setMarkerStyle('redBigMarker') : setMarkerStyle('greenMarker');
      markerEvtSubsc = Object.keys(mapboxMarkerEvents$).map(e =>
        mapboxMarkerEvents$[e].subscribe(() =>
          handleMapboxMarkerEvent({ map, evt: e, id, marker, ifselected, dispatch, setMarkerStyle })
        )
      );
    }
    return () => markerEvtSubsc.forEach(s => s.unsubscribe());
  }, [mapboxMarkerEvents$, selectedMarker]);

  useEffect(() => {
    if (marker) {
      marker.setLngLat([position[1], position[0]]);
    }
  }, [position]);

  return (
    <div>
      <Tooltip title={title} mouseLeaveDelay={0}>
        <div ref={el} className={markerStyle} />
      </Tooltip>
    </div>
  );
};
