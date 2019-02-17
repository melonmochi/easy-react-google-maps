import { FunctionComponent,
  useContext, useState, useEffect } from 'react';
import { labelInTwoString } from './label-in-two-string';
import { AllInOneMarkerProps } from 'typings';
import { GlobalContext } from 'src/components/global-context';
import { Observable, Subscription } from 'rxjs';
import { loadStream, handleMarkerEvt, setDefaultIcon } from 'gm';
import { gmMarkerEvents, ifSelected } from 'utils'
import { setOrangeIcon } from '../marker-event';

interface GmMarkerProps {
  map: google.maps.Map;
  id: string;
  props: AllInOneMarkerProps;
}

export const Marker: FunctionComponent<GmMarkerProps> = props => {
  const { map: gmMap,
    id,
    props: mProps } = props;
  const { title, position, label, withLabel, draggable, animation,
    markerEvtHandlers,
  } = mProps;
  const { state, dispatch } = useContext(GlobalContext);
  const { selectedMarker } = state;
  const gmlabel = label ? labelInTwoString(label) : labelInTwoString(title);
  const markerOpt = {
    icon: '',
    map: gmMap,
    title,
    position: new google.maps.LatLng(position[0], position[1]),
    label: withLabel ? gmlabel : undefined,
    draggable,
    animation: animation ? google.maps.Animation[animation] : undefined,
  };

  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [event$, setEvent$] = useState<Array<{evt: string, e$: Observable<{}>}>>([])

  const createMarker = () => new google.maps.Marker(markerOpt);

  const setEventStream = (m: google.maps.Marker) => gmMarkerEvents
    .map( e => ({
      evt: e,
      e$: loadStream(e, m),
    }))

  useEffect(() => {
    let evtSubcrpts: Array<Subscription> = []
    if(!marker) {
      const m = createMarker()
      setMarker(m)
      setEvent$(setEventStream(m))
    } else {
      const ifselected = ifSelected(id, selectedMarker)
      ifselected? setOrangeIcon(marker): setDefaultIcon(marker)
      marker.setPosition(new google.maps.LatLng(position[0], position[1]))
      evtSubcrpts = event$.map( e =>
        e.e$.subscribe(() => handleMarkerEvt(
          { evt: e.evt, id, marker, ifselected, dispatch, markerEvtHandlers }
        )))
    };
    return () => evtSubcrpts.map(es => es.unsubscribe())
  }, [position, selectedMarker, event$])

  return null
};
