import React, { FunctionComponent, useState, useEffect, useContext } from 'react';
import { labelInTwoString } from './label-in-two-string';
import { MarkerEvents, camelCase } from 'utils';
import { AllInOneMarkerProps, MarkerEvtHandlersType, MarkerEvtNameType } from 'typings';
import { GlobalContext } from 'src/components/global-context';

interface GmMarkerProps {
  map: google.maps.Map;
  id: string;
  props: AllInOneMarkerProps;
}

export const Marker: FunctionComponent<GmMarkerProps> = props => {
  const { map, id, props: mProps } = props;

  const { title, position, label, withLabel, draggable, animation, markerEvtHandlers } = mProps;

  const gmlabel = label ? labelInTwoString(label) : labelInTwoString(title);

  const markerOpt = {
    map,
    title,
    position: new google.maps.LatLng(position[0], position[1]),
    label: withLabel ? gmlabel : undefined,
    draggable,
    animation: animation ? google.maps.Animation[animation] : undefined,
  };

  const { dispatch } = useContext(GlobalContext);

  const [marker, setMarker] = useState<google.maps.Marker | undefined>(undefined);

  useEffect(() => {
    renderMarker();
    return () => {
      clearMarker();
    };
  }, [props]);

  const renderMarker = () => {
    const newMarker = new google.maps.Marker(markerOpt);
    setMarker(newMarker);
    addMarkerListeners(newMarker);
  };

  const addMarkerListeners = (mar: google.maps.Marker) => {
    MarkerEvents.forEach(e => {
      mar.addListener(e, handleMarkerEvent(mar, e, markerEvtHandlers));
    });
  };

  const clearMarker = () => {
    if (marker) {
      marker.setMap(null);
    }
  };

  const handleMarkerEvent = (
    m: google.maps.Marker,
    evt: string,
    marEvtHnds?: MarkerEvtHandlersType
  ) => {
    return () => {
      const evtName = `on${camelCase(evt)}` as MarkerEvtNameType;
      if (marEvtHnds) {
        const customMarkerEvtHnd = marEvtHnds[evtName];
        if (customMarkerEvtHnd) {
          customMarkerEvtHnd(m);
        } else {
          defaultMarkerEvtHnds(evtName, m);
        }
      } else {
        defaultMarkerEvtHnds(evtName, m);
      }
    };
  };

  const defaultMarkerEvtHnds = (evtName: string, m: google.maps.Marker) => {
    switch (evtName) {
      case 'onClick':
        break;
      case 'onDblclick':
        break;
      case 'onRightclick':
        break;
      case 'onDrag':
        break;
      case 'onDragstart':
        clearMarker();
        break;
      case 'onDragend':
        dispatch({
          type: 'CHANGE_MARKER_POSITION',
          payload: {
            id: id,
            newPosition: [m.getPosition().lat(), m.getPosition().lng()],
          },
        });
        break;
      default:
        break;
      // throw new Error('No corresponding event')
    }
  };

  const renderChildren = () => {
    const { children } = props;

    if (!children) {
      return;
    }

    return React.Children.map(children, c => {
      if (!c) {
        return;
      }
      return React.cloneElement(c as React.ReactElement<any>, {
        marker,
      });
    });
  };
  return <div>{marker ? renderChildren() : null}</div>;
};
