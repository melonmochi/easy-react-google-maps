import { FunctionComponent, useEffect, useContext, useState } from 'react';
import { labelInTwoString } from './label-in-two-string';
import { gmMarkerEvents } from 'utils';
import { AllInOneMarkerProps } from 'typings';
import { GlobalContext } from 'src/components/global-context';
import { fromEventPattern, merge } from 'rxjs';
import { handleMarkerEvt } from 'gm';
import { filter } from 'rxjs/operators';

interface GmMarkerProps {
  map: google.maps.Map;
  id: string;
  props: AllInOneMarkerProps;
}

export const Marker: FunctionComponent<GmMarkerProps> = props => {
  const { map, id, props: mProps } = props;
  const { title, position, label, withLabel, draggable, animation, markerEvtHandlers } = mProps;
  const { state, dispatch } = useContext(GlobalContext);
  const { mapProvider } = state;
  const gmlabel = label ? labelInTwoString(label) : labelInTwoString(title);
  const markerOpt = {
    map,
    title,
    position: new google.maps.LatLng(position[0], position[1]),
    label: withLabel ? gmlabel : undefined,
    draggable,
    animation: animation ? google.maps.Animation[animation] : undefined,
  };

  const [marker, setMarker] = useState<google.maps.Marker | null>(null);

  useEffect(() => {
    if (!marker) {
      renderMarker();
    } else {
      marker.setPosition(new google.maps.LatLng(position[0], position[1]));
    }
  }, [position]);

  const renderMarker = () => {
    const newMarker = new google.maps.Marker(markerOpt);
    setMarker(newMarker);
    setEventStream(newMarker);
  };

  const setEventStream = (m: google.maps.Marker) => {
    const events$ = gmMarkerEvents.map(e => ({
      e: e,
      e$: fromEventPattern(
        handler => m.addListener(e, handler),
        (_handler, listener) => google.maps.event.removeListener(listener)
      ),
    }));
    merge(
      events$.map(s =>
        s.e$
          .pipe(filter(() => mapProvider === 'google'))
          .subscribe(handleMarkerEvt(s.e, id, m, dispatch, markerEvtHandlers))
      )
    );
  };

  return null;
};
