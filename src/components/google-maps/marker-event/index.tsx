import { MarkerEvtHandlersType, GlobalContextDispatch } from 'typings';
import { camelCase } from 'utils';

import blueIconURL from 'assets/images/marker-blue.svg'
import orangeIconURL from 'assets/images/marker-orange.svg'

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

type defaultMarkerEvtHnds = {
  evtName: string,
  id: string,
  marker: google.maps.Marker,
  ifselected: boolean,
  dispatch: GlobalContextDispatch
}

type handleMarkerEvt = {
  evt: string,
  id: string,
  marker: google.maps.Marker,
  ifselected: boolean,
  dispatch: GlobalContextDispatch
  markerEvtHandlers?: MarkerEvtHandlersType | any
}

export const defaultMarkerEvtHnds = (input: defaultMarkerEvtHnds)  => {
  const { evtName, id, marker, ifselected, dispatch } = input
  switch (evtName) {
    case 'onClick':
      dispatch({type: 'SELECT_MARKER', payload: id})
      break;
    case 'onDragend':
      dispatch({
        type: 'CHANGE_MARKER_POSITION',
        payload: {
          id: id,
          newPosition: [marker.getPosition().lat(), marker.getPosition().lng()],
        },
      });
      break;
    case 'onMouseout':
      return !ifselected && setDefaultIcon(marker)
    case 'onMouseover':
      return !ifselected && setBlueIcon(marker)
    default:
    // throw new Error('No corresponding event')
  }
};

export const handleMarkerEvt = (input: handleMarkerEvt)  => {
  const { evt, id, marker, markerEvtHandlers, ifselected, dispatch } = input
  const evtName = `on${camelCase(evt)}`;
  if (markerEvtHandlers) {
    const customMarkerEvtHnd = markerEvtHandlers[evtName];
    if (customMarkerEvtHnd) {
      customMarkerEvtHnd(marker);
    } else {
      defaultMarkerEvtHnds({ evtName, id, marker, ifselected, dispatch });
    }
  } else {
    defaultMarkerEvtHnds({ evtName, id, marker, ifselected, dispatch })
  }
};
