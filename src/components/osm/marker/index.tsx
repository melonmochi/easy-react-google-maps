import React, { FunctionComponent, useState, useEffect } from 'react';
import L from 'leaflet';
import { handleMarkerEvent } from './marker-event';
import { MarkerEvents } from 'utils';
import { AllInOneMarkerProps } from 'typings';

interface OSMMarkerProps extends AllInOneMarkerProps {
  map: L.Map;
  id: string;
}

export const Marker: FunctionComponent<OSMMarkerProps> = props => {
  const { map, title, draggable } = props;

  const markerOpt = {
    title,
    draggable: draggable ? draggable : false,
  };

  const [marker, setMarker] = useState<L.Marker | undefined>(undefined);

  useEffect(() => {
    renderMarker();
    return () => {
      clearMarker();
    };
  }, [props]);

  const renderMarker = () => {
    if (map) {
      const { position } = props;
      const newMarker = L.marker(position, markerOpt).addTo(map);
      setMarker(newMarker);
      addMarkerListeners(newMarker);
    }
  };

  const addMarkerListeners = (mar: L.Marker) => {
    MarkerEvents.forEach(e => {
      mar.on(e, handleMarkerEvent(mar, e, props.markerEvtHandlers));
    });
  };

  const clearMarker = () => {
    if (map && marker) {
      map.removeLayer(marker);
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
        mapProvider: 'osm',
        marker,
      });
    });
  };
  return <div>{marker ? renderChildren() : null}</div>;
};
