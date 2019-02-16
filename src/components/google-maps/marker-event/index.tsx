import { MarkerEvtHandlersType, GlobalContextDispatch } from 'typings';
import { camelCase } from 'utils';

import blueIconURL from 'assets/images/marker-blue.svg'
import orangeIconURL from 'assets/images/marker-orange.svg'

type defaultMarkerEvtHnds = {
  evtName: string,
  id: string,
  m: google.maps.Marker
  dispatch: GlobalContextDispatch
}

export const setDefaultIcon = (m: google.maps.Marker) => {
  m.setIcon('')
}
export const setBlueIcon = (m: google.maps.Marker) => {
  m.setIcon({
    url: blueIconURL,
    labelOrigin: new google.maps.Point(25, 20),
    anchor: new google.maps.Point(25, 50),
    scaledSize: new google.maps.Size(50, 50),
  })
}
export const setOrangeIcon = (m: google.maps.Marker) => m.setIcon({
  url: orangeIconURL,
  labelOrigin: new google.maps.Point(25, 20),
  anchor: new google.maps.Point(25, 50),
  scaledSize: new google.maps.Size(50, 50),
})

export const defaultMarkerEvtHnds = (input: defaultMarkerEvtHnds)  => {
  const { evtName, id, m, dispatch } = input
  switch (evtName) {
    case 'onClick':
      dispatch({type: 'SELECT_MARKER', payload: id})
      break;
    case 'onDragend':
      console.log('im dragging')
      dispatch({
        type: 'CHANGE_MARKER_POSITION',
        payload: {
          id: id,
          newPosition: [m.getPosition().lat(), m.getPosition().lng()],
        },
      });
      break;
    case 'onMouseout':
      setDefaultIcon(m)
      break;
    case 'onMouseover':
      setBlueIcon(m)
    default:
    // throw new Error('No corresponding event')
  }
};

type handleMarkerEvt = {
  evt: string,
  id: string,
  m: google.maps.Marker,
  dispatch: GlobalContextDispatch
  markerEvtHandlers?: MarkerEvtHandlersType | any
}
export const handleMarkerEvt = (input: handleMarkerEvt)  => {
  const { evt, id, m, markerEvtHandlers, dispatch } = input
  const evtName = `on${camelCase(evt)}`;
  if (markerEvtHandlers) {
    const customMarkerEvtHnd = markerEvtHandlers[evtName];
    if (customMarkerEvtHnd) {
      customMarkerEvtHnd(m);
    } else {
      defaultMarkerEvtHnds({ evtName, id, m, dispatch });
    }
  } else {
    defaultMarkerEvtHnds({ evtName, id, m, dispatch })
  }
};
