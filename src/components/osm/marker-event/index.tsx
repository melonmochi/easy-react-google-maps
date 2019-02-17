import { camelCase } from 'utils';
import { MarkerEvtHandlersType, GlobalContextDispatch } from 'typings';
import L from 'leaflet';
import blueIconURL from 'assets/images/marker-blue.svg'
import orangeIconURL from 'assets/images/marker-orange.svg'
import { osmGreenIcon } from 'osm'

const osmBlueIcon = L.icon({iconUrl: blueIconURL});
const osmOrangeIcon = L.icon({iconUrl: orangeIconURL});

export const setDefaultIcon = (m: L.Marker) => {
  m.setIcon(osmGreenIcon)
}
export const setBlueIcon = (m: L.Marker) => {
  m.setIcon(osmBlueIcon)
}
export const setOrangeIcon = (m: L.Marker) => {
  m.setIcon(osmOrangeIcon)
}

type defaultMarkerEvtHndsType = {
  evtName: string,
  id: string,
  marker: L.Marker
  ifselected: boolean,
  dispatch: GlobalContextDispatch
}

type handleMarkerEvtType = {
  evt: string,
  id: string,
  marker: L.Marker,
  ifselected: boolean,
  dispatch: GlobalContextDispatch,
  markerEvtHandlers?: MarkerEvtHandlersType | any
}

const defaultOSMMarkerEvtHnds = (input: defaultMarkerEvtHndsType) => {
  const { evtName, id, marker, ifselected, dispatch } = input
  switch (evtName) {
    case 'onClick':
      dispatch({ type: 'SELECT_MARKER', payload: id })
      break;
    case 'onMoveend':
      dispatch({
        type: 'CHANGE_MARKER_POSITION',
        payload: {
          id,
          newPosition: [marker.getLatLng().lat, marker.getLatLng().lng],
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

export const handleMarkerEvt = (input: handleMarkerEvtType) => {
  const { evt, id, marker, ifselected, dispatch, markerEvtHandlers } = input
  const evtName = `on${camelCase(evt)}`;
  if (markerEvtHandlers) {
    const customMarkerEvtHnd = markerEvtHandlers[evtName];
    if (customMarkerEvtHnd) {
      customMarkerEvtHnd(marker);
    } else {
      defaultOSMMarkerEvtHnds({ evtName, id, marker, ifselected, dispatch });
    }
  } else {
    defaultOSMMarkerEvtHnds({ evtName, id, marker, ifselected, dispatch });
  }
};
