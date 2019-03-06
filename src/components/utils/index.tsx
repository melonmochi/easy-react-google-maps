import { LatLng } from 'typings';

export function camelCase(name: string) {
  return (
    name.charAt(0).toUpperCase() +
    // tslint:disable-next-line:variable-name
    name.slice(1).replace(/-(\w)/g, (_m, n) => {
      return n.toUpperCase();
    })
  );
}

export const stringToColour = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    // tslint:disable-next-line:no-bitwise
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = '#';
  for (let i = 0; i < 3; i++) {
    // tslint:disable-next-line:no-bitwise
    const value = (hash >> (i * 8)) & 0xff;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
};

export const defaultCenter: LatLng = [0, 0];
export const defaultZoom: number = 2;

export const GTFSFileNamesArray = [
  'agency',
  'stops',
  'routes',
  // 'trips',
  // 'stop_times',
  'calendar',
  'calendar_dates',
  'fare_attributes',
  'fare_rules',
  // 'shapes',
  'frequencies',
  'transfers',
  'feed_info',
];

export const markerEvents = ['click', 'dblclick', 'dragend', 'mouseout', 'mouseover'];

export const weekDay = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export const dateFormat = 'YYYYMMDD';

export { googleMapsURLStringify } from './google-maps-url-stringify';

export { googleMapsScriptLoader } from './google-maps-script-loader';

export { googleMapsApiLoader } from './google-maps-api-loader';

export { CheckboxWithLabel } from './checkbox-with-label';

export { reducers } from './reducers';

export { calculateBounds } from './calculate-bounds';

export { extendBounds } from './extend-bounds';

export { boundsToCenters } from './bounds-to-center';

export { ifSelected } from './if-selected';

export { Stops2Markers } from './stops-to-markers';

export {
  markerToGeoJSON,
  markersToGeoJSON,
  markerToMapboxGeoJSON,
  markersToMapboxGeoJSON,
} from './geojson';

export {
  boundsToGmbounds,
  gmBoundsToBounds,
  boundsToOSMBounds,
  OSMBoundsToBounds,
  boundsToMapboxBounds,
  mapboxBoundsToBounds,
} from './bounds-converter';

export const city = {
  London: [51.5072, -0.1275] as LatLng,
  Madrid: [40.4165, -3.70256] as LatLng,
  NewYork: [40.6643, -73.9385] as LatLng,
  Shanghai: [31.22222, 121.45806] as LatLng,
  Tokyo: [35.6895, 139.69171] as LatLng,
};

const randomNumber = (a: number, b: number) => {
  return a + (b - a) * Math.random();
};

const randomLat = () => randomNumber(38, 42);
const randomLng = () => randomNumber(-5, -1);
export const randomLatLng = () => [randomLat(), randomLng()] as LatLng;

export const chunkArray = (l: Array<any>, part: number) => {
  const chunk = Math.ceil(part);
  const len = l.length;
  if (chunk <= len) {
    const chunkLen = Math.ceil(len / chunk);
    return Array.from(new Array(chunk), (_x, i) => l.slice(i * chunkLen, i * chunkLen + chunkLen));
  } else {
    return [l];
  }
};
