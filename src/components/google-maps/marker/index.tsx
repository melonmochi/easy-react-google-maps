import { FunctionComponent, useEffect, useContext, useState } from 'react';
import { labelInTwoString } from './label-in-two-string';
import { AllInOneMarkerProps, AddMarkerToListInputType } from 'typings';
import { GlobalContext } from 'src/components/global-context';
import { fromEventPattern, merge, Observable, Subscription } from 'rxjs';
import { handleMarkerEvt, setOrangeIcon, setDefaultIcon } from 'gm';
import { filter, takeUntil, switchMap
} from 'rxjs/operators';

interface GmMarkerProps {
  map: google.maps.Map;
  id: string;
  props: AllInOneMarkerProps;
}

const loadGm$ = (evt: string, m: google.maps.Marker) => fromEventPattern(
  handler => m.addListener(evt, handler),
  (_handler, listener) => google.maps.event.removeListener(listener)
)

export const Marker: FunctionComponent<GmMarkerProps> = props => {
  const { map: gmMap, id, props: mProps } = props;
  const { title, position, label, withLabel, draggable, animation, markerEvtHandlers } = mProps;
  const { state, dispatch } = useContext(GlobalContext);
  const { mapProvider, selectedMarker } = state;
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

  const ifSeleted = (selectM?: AddMarkerToListInputType) => {
    if(selectM) {
      return selectM.id === id? true: false
    } else {
      return false
    }
  }

  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [mouseover$, setMouseover$] = useState<Observable<{}>>(new Observable());
  const [mouseOver$, setMouseOver$] = useState<Subscription>(new Observable().subscribe());
  const [mouseout$, setMouseout$] = useState<Observable<{}>>(new Observable());
  const [mouseOut$, setMouseOut$] = useState<Subscription>(new Observable().subscribe());

  useEffect(() => {
    if (!marker) {
      renderMarker();
    } else {
      if(ifSeleted(selectedMarker)){
        setOrangeIcon(marker)
        mouseOver$.unsubscribe()
        mouseOut$.unsubscribe()
      } else {
        setDefaultIcon(marker)
        setMouseOver$(mouseover$.pipe(
          filter(() => mapProvider === 'google')
        ).subscribe(() => {
          console.log('im subscribing mouseover')
          handleMarkerEvt({ evt: 'mouseover', id, m: marker, dispatch, markerEvtHandlers })
        }))
        setMouseOut$(mouseout$.pipe(
          filter(() => mapProvider === 'google')
        ).subscribe(() => {
          handleMarkerEvt({ evt: 'mouseout', id, m: marker, dispatch, markerEvtHandlers })
        }))
      }
      marker.setPosition(new google.maps.LatLng(position[0], position[1]));
    };
    return () => {
      mouseOver$.unsubscribe()
      mouseOut$.unsubscribe()
    }
  }, [position, selectedMarker, mouseover$, mouseout$]);

  const renderMarker = () => {
    const newMarker = new google.maps.Marker(markerOpt);
    setMarker(newMarker);
    setEventStream(newMarker);
  };

  const setMouseOverOutStream = (m: google.maps.Marker) => {
    const dragend$ = loadGm$('dragend', m)
    const dragstart$ = loadGm$('dragstart', m)
    const mOver$ = loadGm$('mouseover', m).pipe(takeUntil(dragstart$))
    const mOut$ = loadGm$('mouseout', m).pipe(takeUntil(dragstart$))
    const mOv$ = dragend$.pipe(switchMap(() => loadGm$('mouseover', m).pipe(takeUntil(dragstart$))))
    const mOt$ = dragend$.pipe(switchMap(() => loadGm$('mouseout', m).pipe(takeUntil(dragstart$))))
    return [merge(mOver$, mOv$), merge(mOut$, mOt$)] as [ Observable<{}>, Observable<{}> ]
  }

  const setEventStream = (m: google.maps.Marker) => {
    const click$ = loadGm$('click', m)
    const dragend$ = loadGm$('dragend', m)
    setMouseover$(setMouseOverOutStream(m)[0])
    setMouseout$(setMouseOverOutStream(m)[1])
    dragend$.pipe(
      filter(() => mapProvider === 'google')
    ).subscribe(
      () => {
        handleMarkerEvt({ evt: 'dragend', id, m, dispatch, markerEvtHandlers })
      })
    click$.pipe(
      filter(() => mapProvider === 'google')
    ).subscribe(
      () => {
        handleMarkerEvt({ evt: 'click', id, m, dispatch, markerEvtHandlers })
      })
  };
return null
};
