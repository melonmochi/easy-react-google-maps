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
    const value = (hash >> (i * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  }
  return colour;
}

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

export const gmMapEvents = [
  'bounds_changed',
  'center_changed',
  'click',
  'dblclick',
  'drag',
  'dragend',
  'dragstart',
  'heading_changed',
  'idle',
  'maptypeid_changed',
  'mousemove',
  'mouseout',
  'mouseover',
  'projection_changed',
  'rightclick',
  'tilesloaded',
  'tilt_changed',
  'zoom_changed',
];

export const MarkerEvents = [
  'click',
  'dblclick',
  'drag',
  'dragend',
  'draggable_changed',
  'dragstart',
  'mousedown',
  'mouseout',
  'mouseover',
  'mouseup',
  'rightclick',
];

export const weekDay = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const dateFormat = 'YYYYMMDD'

export { googleMapsURLStringify } from './google-maps-url-stringify'

export { googleMapsScriptLoader } from './google-maps-script-loader'

export { googleMapsApiLoader } from './google-maps-api-loader'

export { childrenMarkerToObject } from './children-marker-to-object'

export { CheckboxWithLabel } from './checkbox-with-label'

export { extendBounds } from './extend-bounds'

export { reducers } from './reducers'
