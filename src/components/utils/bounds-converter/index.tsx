import { Bounds, LatLng } from 'typings';
import L from 'leaflet';
import mapboxgl from 'mapbox-gl';

export const boundsToGmbounds = (bounds: Bounds) => {
  const sw = new google.maps.LatLng(bounds[0][0], bounds[0][1]);
  const ne = new google.maps.LatLng(bounds[1][0], bounds[1][1]);
  return new google.maps.LatLngBounds(sw, ne);
};

export const gmBoundsToBounds = (gmBounds: google.maps.LatLngBounds) => {
  const sw = gmBounds.getSouthWest();
  const ne = gmBounds.getNorthEast();
  const newBounds = [[sw.lat(), sw.lng()], [ne.lat(), ne.lng()]] as [LatLng, LatLng];
  return newBounds;
};

export const boundsToOSMBounds = (bounds: Bounds) => {
  const [sw, ne] = bounds;
  const osmBounds = new L.LatLngBounds(sw, ne);
  return osmBounds;
};

export const OSMBoundsToBounds = (OSMBounds: L.LatLngBounds) => {
  const sw = OSMBounds.getSouthWest();
  const ne = OSMBounds.getNorthEast();
  const newBounds = [[sw.lat, sw.lng], [ne.lat, ne.lng]] as [LatLng, LatLng];
  return newBounds;
};

export const boundsToMapboxBounds = (bounds: Bounds) => {
  const [sw, ne] = bounds;
  const mapboxSW = sw.reverse() as LatLng;
  const mapboxNE = ne.reverse() as LatLng;
  const mapboxBounds = new mapboxgl.LngLatBounds(mapboxSW, mapboxNE);
  return mapboxBounds;
};

export const mapboxBoundsToBounds = (mapboxBounds: mapboxgl.LngLatBounds) => {
  const sw = mapboxBounds.getSouthWest();
  const ne = mapboxBounds.getNorthEast();
  const newBounds = [[sw.lat, sw.lng], [ne.lat, ne.lng]] as [LatLng, LatLng];
  return newBounds;
};
