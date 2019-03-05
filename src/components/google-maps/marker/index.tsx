import { FunctionComponent, useContext, useState, useEffect } from 'react';
import { AllInOneMarkerProps, EvtStreamType } from 'typings';
import { GlobalContext } from 'src/components/global-context';
import { Subscription } from 'rxjs';
import {
  setGmMarkerConfig,
  setMarkerEventStream,
  setDefaultIcon,
  setOrangeIcon,
  handleGmMarkerEvent,
} from 'gm';
import { ifSelected } from 'utils';

interface GmMarkerProps {
  map: google.maps.Map;
  id: string;
  props: AllInOneMarkerProps;
}

export const Marker: FunctionComponent<GmMarkerProps> = props => {
  const { map, id, props: mProps } = props;
  const { title, position, label, withLabel, draggable, animation } = mProps;
  const { state, dispatch } = useContext(GlobalContext);
  const { selectedMarker } = state;
  const markerOpt = setGmMarkerConfig({
    map,
    title,
    position,
    draggable,
    withLabel,
    label,
    animation,
  });

  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [gmMarkerEvents$, setGmMarkerEvents$] = useState<EvtStreamType>({});

  const createMarker = () => new google.maps.Marker(markerOpt);

  useEffect(() => {
    const m = createMarker();
    setMarker(m);
    setGmMarkerEvents$(setMarkerEventStream(m));
    dispatch({ type: 'ADD_MARKER_TO_GM_CLUSTER', payload: { map, marker: m } });
  }, []);

  useEffect(() => {
    let markerEvtSubsc: Array<Subscription> = [];
    if (marker) {
      marker.setPosition(new google.maps.LatLng(position[0], position[1]));
      const ifselected = ifSelected(id, selectedMarker);
      ifselected ? setOrangeIcon(marker) : setDefaultIcon(marker);
      markerEvtSubsc = Object.keys(gmMarkerEvents$).map(e =>
        gmMarkerEvents$[e].subscribe(() =>
          handleGmMarkerEvent({ map, evt: e, id, marker, position, ifselected, dispatch })
        )
      );
    }
    return () => markerEvtSubsc.forEach(s => s.unsubscribe());
  }, [gmMarkerEvents$, selectedMarker, position]);

  return null;
};
