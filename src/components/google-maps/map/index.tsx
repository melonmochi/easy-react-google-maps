import React, { FunctionComponent, useEffect, useContext, useRef } from 'react';
import { gmMapEvents } from 'utils';
import { GlobalContext } from 'src/components/global-context';
import { Spin } from 'antd';
import { Marker, handleMapEvent } from 'gm';
import { AddMarkerToListInputType } from 'typings';

interface GoogleMapsMapProps {
  google: typeof google;
}

export const GoogleMapsMap: FunctionComponent<GoogleMapsMapProps> = props => {
  const { state, dispatch } = useContext(GlobalContext);
  const { mapProps, gmMap, currentCenter } = state;
  const { google } = props;

  const { gestureHandling, gmMaptype, gmMapEvtHandlers } = mapProps;

  const mapConfig: object = Object.assign(
    {},
    {
      center: {lat: currentCenter[0], lng: currentCenter[1]},
      gestureHandling,
      mapTypeId: gmMaptype, // optional main map layer. Terrain, satellite, hybrid or roadmap--if unspecified, defaults to roadmap.
      zoom: state.zoom, // sets zoom. Lower numbers are zoomed further out.
      mapTypeControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT,
      },
      fullscreenControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP,
      },
    }
  );

  useEffect(() => {
    if(!gmMap) {
      initMap();
    }
    return () => {
      clearMap();
    };
  }, []);

  const gmMapRef = useRef<HTMLDivElement>(null);

  const initMap = () => {
    const newMap = new google.maps.Map(gmMapRef.current, mapConfig);
    addMapListeners(newMap);
    dispatch({type:'SET_GM_MAP', payload: newMap})
  };

  const clearMap = () => {
    if (gmMap) {
      removeMapListeners(gmMap);
    }
  };

  const addMapListeners = (m: google.maps.Map) => {
    gmMapEvents.forEach(e => {
      m.addListener(e, handleMapEvent(m, e, dispatch, gmMapEvtHandlers));
    });
  };

  const removeMapListeners = (m: google.maps.Map) => {
    google.maps.event.clearInstanceListeners(m);
  };

  const Markers = (gmap: google.maps.Map) => state.markersList.map(
    (m: AddMarkerToListInputType) => <Marker key={m.id} id={m.id} map={gmap} props={m.props} />
  )

  return (
    <div className='defaultContainer'>
      <div className='defaultMap' ref={gmMapRef} />
      <Spin
        tip="Loading Map..."
        spinning={gmMap ? false : true}
        size="large"
        style={{ width: '100%', margin: 'auto', zIndex: 11 }}
      />
      {gmMap? Markers(gmMap): null}
    </div>
  );
};
