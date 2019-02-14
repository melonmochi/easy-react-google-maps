import { LatLng, Bounds } from 'typings';
import L from 'leaflet';

export const extendBounds = (bounds: Bounds, point: LatLng) => {
  const OSMBounds = new L.LatLngBounds(bounds);
  OSMBounds.extend(point);
  return [
    [OSMBounds.getSouthWest().lat, OSMBounds.getSouthWest().lng],
    [OSMBounds.getNorthEast().lat, OSMBounds.getNorthEast().lng],
  ] as Bounds;
};
