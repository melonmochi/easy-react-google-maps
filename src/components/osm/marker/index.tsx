import L from 'leaflet';
import { AllInOneMarkerProps } from 'typings';
import { FunctionComponent, useState, useEffect, useContext } from 'react';
import { GlobalContext } from 'src/components/global-context';
import { Observable, Subscription } from 'rxjs';
import { handleMarkerEvt, loadStream, setDefaultIcon, setOrangeIcon } from 'osm';
import { ifSelected, markerEvents } from 'utils';

interface OSMMarkerProps {
  map: L.Map;
  id: string;
  props: AllInOneMarkerProps;
}

export const Marker: FunctionComponent<OSMMarkerProps> = props => {
  const { map, id, props: mProps } = props;
  const { title, draggable, position, markerEvtHandlers } = mProps;
  const { state, dispatch } = useContext(GlobalContext);
  const { selectedMarker } = state;
  const markerOpt = {
    title,
    draggable: draggable ? draggable : false,
  };

  const [marker, setMarker] = useState<L.Marker | undefined>(undefined);
  const [event$, setEvent$] = useState<Array<{ evt: string; e$: Observable<{}> }>>([]);

  const createMarker = () => L.marker(position, markerOpt).addTo(map);

  const setEventStream = (m: L.Marker) =>
    markerEvents.map(e => ({
      evt: e,
      e$: loadStream(e, m),
    }));

  useEffect(() => {
    let evtSubcrpts: Array<Subscription> = [];
    if (!marker) {
      const m = createMarker();
      setMarker(m);
      setEvent$(setEventStream(m));
    } else {
      const ifselected = ifSelected(id, selectedMarker);
      ifselected ? setOrangeIcon(marker) : setDefaultIcon(marker);
      marker.setLatLng([position[0], position[1]]);
      evtSubcrpts = event$.map(e =>
        e.e$.subscribe(() =>
          handleMarkerEvt({ map, evt: e.evt, id, marker, ifselected, dispatch, markerEvtHandlers })
        )
      );
    }
    return () => evtSubcrpts.map(es => es.unsubscribe());
  }, [position, selectedMarker, event$]);

  return null;
};
