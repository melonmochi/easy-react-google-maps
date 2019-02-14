import { LatLng, Bounds } from 'typings';

export const calculateBounds = (points: Array<LatLng>) => {
  const newS = Math.min(90, ...points.map(p => p[0]));
  const newW = Math.min(180, ...points.map(p => p[1]));
  const newN = Math.max(-90, ...points.map(p => p[0]));
  const newE = Math.max(-180, ...points.map(p => p[1]));
  return [[newS, newW], [newN, newE]] as Bounds;
};
