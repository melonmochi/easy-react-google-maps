type LatLng = google.maps.LatLng
type LatLngLiteral = google.maps.LatLngLiteral
type Place = google.maps.Place
type TravelMode = google.maps.TravelMode
type TransitOptions = google.maps.TransitOptions
type DrivingOptions = google.maps.DrivingOptions
type UnitSystem = google.maps.UnitSystem
interface DirectionsWaypoint {
  /**
   * Waypoint location. Can be an address string, a LatLng, or a Place.
   * Optional.
   */
  location: LatLng|LatLngLiteral|string;
  /**
   * If true, indicates that this waypoint is a stop between the origin and
   * destination. This has the effect of splitting the route into two legs. If
   * false, indicates that the route should be biased to go through this
   * waypoint, but not split into two legs. This is useful if you want to
   * create a route in response to the user dragging waypoints on a map. This
   * value is true by default. Optional.
   */
  stopover: boolean;
}

declare module 'typings' {
  type GoogleMapsControlPosition =
  | 'TOP_LEFT'
  | 'TOP_CENTER'
  | 'TOP_RIGHT'
  | 'LEFT_TOP'
  | 'RIGHT_TOP'
  | 'LEFT_CENTER'
  | 'RIGHT_CENTER'
  | 'LEFT_BOTTOM'
  | 'RIGHT_BOTTOM'
  | 'BOTTOM_LEFT'
  | 'BOTTOM_CENTER'
  | 'BOTTOM_RIGHT';

  type MapTypeId = 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
  type GestureHandlingType = 'cooperative' | 'greedy' | 'none' | 'auto';

  type DirectionsRequest = {
    origin: LatLng | String | Place,
    destination: LatLng | String | Place,
    travelMode: TravelMode,
    transitOptions: TransitOptions,
    drivingOptions: DrivingOptions,
    unitSystem: UnitSystem,
    waypoints: DirectionsWaypoint[],
    optimizeWaypoints: Boolean,
    provideRouteAlternatives: Boolean,
    avoidFerries: Boolean,
    avoidHighways: Boolean,
    avoidTolls: Boolean,
    region: String
  }
}
