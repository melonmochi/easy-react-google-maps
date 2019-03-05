import { LatLng } from 'typings';

type markerToGeoJSONInput = {
  id: string;
  title: string;
  position: LatLng;
};

export const markerToGeoJSON = (input: markerToGeoJSONInput) => {
  const { id, title, position } = input;
  return {
    type: 'Feature',
    id: id,
    geometry: {
      type: 'Point',
      coordinates: position,
    },
    properties: {
      title: title,
    },
  } as GeoJSON.Feature;
};

export const markerToMapboxGeoJSON = (input: markerToGeoJSONInput) => {
  const { id, title, position } = input;
  return {
    type: 'Feature',
    id: parseInt(id, 32),
    geometry: {
      type: 'Point',
      coordinates: [position[1], position[0]],
    },
    properties: {
      markerID: id,
      title: title,
      icon: 'bus',
    },
  } as GeoJSON.Feature;
};

export const markersToGeoJSON = (input: markerToGeoJSONInput[]) =>
  ({
    type: 'FeatureCollection',
    features: input.map(m => markerToGeoJSON(m)),
  } as GeoJSON.FeatureCollection);

export const markersToMapboxGeoJSON = (input: markerToGeoJSONInput[]) =>
  ({
    type: 'FeatureCollection',
    features: input.map(m => markerToMapboxGeoJSON(m)),
  } as GeoJSON.FeatureCollection);
