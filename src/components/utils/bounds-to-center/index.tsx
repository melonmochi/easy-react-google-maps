import { Bounds, LatLng } from 'typings';

export const boundsToCenters = (bounds: Bounds) => {
  const centerX = (bounds[0][1] + bounds[1][1]) / 2;
  const centerY = (bounds[0][0] + bounds[1][0]) / 2;
  return [centerX, centerY] as LatLng;
};
