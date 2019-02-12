import {
  Bounds
} from 'typings'

export const boundsToGmbounds = ( bounds: Bounds ) => {
  const sw = new google.maps.LatLng(bounds[0][0], bounds[0][1])
  const ne = new google.maps.LatLng(bounds[1][0], bounds[1][1])
  return new google.maps.LatLngBounds(sw, ne)
}
