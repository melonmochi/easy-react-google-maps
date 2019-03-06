import { Stops, Stop, AddMarkerToListInputType, LatLng } from 'typings';
import uuidv4 from 'uuid';

const Stop2Marker = (input: Stop) => {
  const { stop_name, stop_lat, stop_lon } = input;
  return {
    type: 'gtfs',
    id: uuidv4(),
    props: {
      title: stop_name,
      position: [parseFloat(stop_lat), parseFloat(stop_lon)] as LatLng,
      draggable: true,
    },
    hide: false,
    gtfsInfo: input,
  } as AddMarkerToListInputType;
};

export const Stops2Markers = (input: Stops) => {
  return Object.keys(input).map(key => Stop2Marker(input[key]));
};
