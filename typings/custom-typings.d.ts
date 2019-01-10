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

  type Calendar = {
    service_id: string,
    start_date: string,
    end_date: string,
    monday: string,
    tuesday: string,
    wednesday: string,
    thursday: string,
    friday: string,
    saturday: string,
    sunday: string,
  }

  type Calendars = {
    [key: string]: Calendar
  }

  type CalendarDate = {
    service_id: string,
    date: string,
    exception_type: string
  }

  type CalendarDates = {
    [key: string]: CalendarDate
  }

  type Stop = {
    stop_id: string
    stop_code?: string
    stop_name: string
    stop_desc?: string
    stop_lat: string
    stop_lon: string
    zone_id?: string
    stop_url?: string
    loacation_type?: string
    parent_station?: string
    stop_timezone?: string
    wheelchair_boarding?: string
  }

  type Stops = {
    [key: string]: Stop
  }

  type RouteShort = {
    route_id: string
    agency_id?: string
    route_short_name: string
    route_long_name?: string
    route_desc?: string
    route_type: string
    route_url?: string
    route_color?: string
    route_text_color?: string
    route_sort_order?: string
  }

  type RouteLong = {
    route_id: string
    agency_id?: string
    route_short_name?: string
    route_long_name: string
    route_desc?: string
    route_type: string
    route_url?: string
    route_color?: string
    route_text_color?: string
    route_sort_order?: string
  }

  type RoutesShort = {
    [key: string]: RouteShort
  }

  type RoutesLong = {
    [key: string]: RouteLong
  }

  type GTFSFile = {
    agency?: Object,
    stops?: Stops,
    routes?: RoutesShort | RoutesLong,
    trips?: Object,
    stop_times?: Object,
    calendar?: Calendars
    calendar_dates?: CalendarDates
    fare_attributes?: Object,
    fare_rules?: Object,
    shapes?: Object,
    frequencies?: Object,
    transfers?: Object,
    feed_info?: Object,
  }
}
