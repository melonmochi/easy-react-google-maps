import {
  LatLng,
  Bounds
} from 'typings'
import L from 'leaflet';

export const extendBounds = ( bounds: Bounds, point: LatLng ) => {
  const newBounds = new L.LatLngBounds(bounds[0], bounds[1]).extend(point)
  const newS = newBounds.getSouth()
  const newW = newBounds.getWest()
  const newN = newBounds.getNorth()
  const newE = newBounds.getEast()
  return [[newS, newW], [newN, newE]] as Bounds
}
