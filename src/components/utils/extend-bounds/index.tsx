import { LatLng, Bounds } from 'typings';

export const extendBounds = (bounds: Bounds, point: LatLng) => {
  const newS = Math.min(90, bounds[0][0], point[0]);
  const newW = Math.min(180, bounds[0][1], point[1]);
  const newN = Math.max(-90, bounds[1][0], point[0]);
  const newE = Math.max(-180, bounds[1][1], point[1]);
  return [[newS, newW], [newN, newE]] as Bounds;
};
