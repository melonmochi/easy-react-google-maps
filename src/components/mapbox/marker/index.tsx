import './style';
import React, { FunctionComponent, useState, useEffect, useRef, useContext } from 'react';
import mapboxgl from 'mapbox-gl';
import { AllInOneMarkerProps } from 'typings';
import { GlobalContext } from 'src/components/global-context';
import { Tooltip } from 'antd';
import { Observable, Subscription } from 'rxjs';
import { loadStream, handleMarkerEvt } from 'mapbox';
import { ifSelected, markerEvents } from 'utils';

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
  const { selectedMarker } = state;
  const [markerStyle, setMarkerStyle] = useState<'greenMarker' | 'blueBigMarker' | 'redBigMarker'>(
    'greenMarker'
  );
  const el = useRef<HTMLDivElement>(null);

  const [marker, setMarker] = useState<mapboxgl.Marker | undefined>(undefined);
  const [event$, setEvent$] = useState<Array<{ evt: string; e$: Observable<{}> }>>([]);

  const createMarker = (node: HTMLDivElement) =>
    new mapboxgl.Marker(node, markerOpt).setLngLat([position[1], position[0]]).addTo(map);

  const setEventStream = (node: HTMLDivElement, m: mapboxgl.Marker) =>
    markerEvents.map(e => ({
      evt: e,
      e$: loadStream(e, node, m),
    }));

  useEffect(() => {
    let evtSubcrpts: Array<Subscription> = [];
    if (!marker) {
      const node = el.current;
      if (node) {
        const m = createMarker(node);
        setMarker(m);
        setEvent$(setEventStream(node, m));
      }
    } else {
      const ifselected = ifSelected(id, selectedMarker);
      ifselected ? setMarkerStyle('redBigMarker') : setMarkerStyle('greenMarker');
      marker.setLngLat([position[1], position[0]]);
      evtSubcrpts = event$.map(e =>
        e.e$.subscribe(() =>
          handleMarkerEvt({
            map,
            evt: e.evt,
            id,
            marker,
            ifselected,
            dispatch,
            markerEvtHandlers,
            setMarkerStyle,
          })
        )
      );
    }
    return () => evtSubcrpts.map(es => es.unsubscribe());
  }, [position, selectedMarker, event$]);

  return (
    <div>
      <Tooltip title={title} mouseLeaveDelay={0}>
        <div ref={el} className={markerStyle} />
      </Tooltip>
    </div>
  );
};
