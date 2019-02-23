import L from 'leaflet';
import { AllInOneMarkerProps, EvtStreamType } from 'typings';
import { FunctionComponent, useState, useEffect, useContext } from 'react';
import { GlobalContext } from 'src/components/global-context';
import { Subscription } from 'rxjs';
import {
  loadOsmMarkerEventsStream,
  setDefaultIcon,
  setOrangeIcon,
  setOsmMarkerConfig,
  handleOsmMarkerEvent,
} from 'osm';
import { ifSelected } from 'utils';

interface OSMMarkerProps {
  map: L.Map;
  id: string;
  props: AllInOneMarkerProps;
}

export const Marker: FunctionComponent<OSMMarkerProps> = props => {
  const { map, id, props: mProps } = props;
  const { title, draggable, position } = mProps;
  const { state, dispatch } = useContext(GlobalContext);
  const { selectedMarker } = state;
  const markerOpt = setOsmMarkerConfig({ title, draggable, position });

  const [marker, setMarker] = useState<L.Marker | undefined>(undefined);
  const [osmMarkerEvents$, setOsmMarkerEvents$] = useState<EvtStreamType>({});

  const createOsmMarker = () => L.marker(markerOpt.position, markerOpt.opt).addTo(map);

  useEffect(() => {
    const m = createOsmMarker();
    setMarker(m);
    setOsmMarkerEvents$(loadOsmMarkerEventsStream(m));
  }, []);

  useEffect(() => {
    let markerEvtSubsc: Array<Subscription> = [];
    if (marker) {
      marker.setLatLng([position[0], position[1]]);
      const ifselected = ifSelected(id, selectedMarker);
      ifselected ? setOrangeIcon(marker) : setDefaultIcon(marker);
      markerEvtSubsc = Object.keys(osmMarkerEvents$).map(e =>
        osmMarkerEvents$[e].subscribe(() =>
          handleOsmMarkerEvent({ map, evt: e, id, marker, position, ifselected, dispatch })
        )
      );
    }
    return () => markerEvtSubsc.forEach(s => s.unsubscribe());
  }, [osmMarkerEvents$, selectedMarker, position]);

  return null;
};
