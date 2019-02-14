import L from 'leaflet';
import { AllInOneMarkerProps } from 'typings';
import { FunctionComponent, useState, useEffect, useContext } from 'react';
import { GlobalContext } from 'src/components/global-context';
import { fromEventPattern, merge } from 'rxjs';
import { handleMarkerEvt } from 'osm';
import { osmMarkerEvents } from 'utils';
import { filter } from 'rxjs/operators';

interface OSMMarkerProps {
  map: L.Map;
  id: string;
  props: AllInOneMarkerProps;
}

export const Marker: FunctionComponent<OSMMarkerProps> = props => {
  const { map, id, props: mProps } = props;
  const { title, draggable, position, markerEvtHandlers } = mProps;
  const { state, dispatch } = useContext(GlobalContext);
  const { mapProvider } = state;
  const [marker, setMarker] = useState<L.Marker | undefined>(undefined);
  const markerOpt = {
    title,
    draggable: draggable ? draggable : false,
  };

  useEffect(() => {
    if (!marker) {
      renderMarker();
    } else {
      marker.setLatLng(position);
    }
  }, [position]);

  const renderMarker = () => {
    if (map) {
      const newMarker = L.marker(position, markerOpt).addTo(map);
      setMarker(newMarker);
      setEventStream(newMarker);
    }
  };

  const setEventStream = (m: L.Marker) => {
    const events$ = osmMarkerEvents.map(e => ({
      e: e,
      e$: fromEventPattern(handler => m.on(e, handler), handler => m.off(e, handler)),
    }));
    merge(
      events$.map(s =>
        s.e$
          .pipe(filter(() => mapProvider === 'osm'))
          .subscribe(handleMarkerEvt(s.e, id, m, dispatch, markerEvtHandlers))
      )
    );
  };

  return null;
};
