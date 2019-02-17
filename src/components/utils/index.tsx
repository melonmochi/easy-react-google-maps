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

export const defaultPosition: LatLng = [40.416778, -3.703778];
export const defaultZoom: number = 14;

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

export const gmMapEvents = ['idle'];

export const osmMapEvents = ['moveend'];

export const mapboxMapEvents = ['moveend'];

export const gmMarkerEvents = [
  'click',
  'dragend',
  'mouseout',
  'mouseover',
]

export const osmMarkerEvents = [
  'click',
  'moveend',
  'mouseout',
  'mouseover',
]

export const mapboxMarkerEvents = [
  'click',
  'dragend',
  'mouseout',
  'mouseover',
]

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

export { childrenMarkerToObject } from './children-marker-to-object';

export { CheckboxWithLabel } from './checkbox-with-label';

export { reducers } from './reducers';

export { calculateBounds } from './calculate-bounds';

export { extendBounds } from './extend-bounds';

export { boundsToCenters } from './bounds-to-center';

export { ifSelected } from './if-selected';

export {
  boundsToGmbounds,
  gmBoundsToBounds,
  boundsToOSMBounds,
  OSMBoundsToBounds,
  boundsToMapboxBounds,
  mapboxBoundsToBounds,
} from './bounds-converter';
