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

  type Calendar = {
    service_id: string;
    start_date: string;
    end_date: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };

  type Calendars = {
    [key: string]: Calendar;
  };

  type CalendarDate = {
    service_id: string;
    date: string;
    exception_type: string;
  };

  type CalendarDates = {
    [key: string]: CalendarDate;
  };

  type Stop = {
    stop_id: string;
    stop_code?: string;
    stop_name: string;
    stop_desc?: string;
    stop_lat: string;
    stop_lon: string;
    zone_id?: string;
    stop_url?: string;
    loacation_type?: string;
    parent_station?: string;
    stop_timezone?: string;
    wheelchair_boarding?: string;
  };

  type Stops = {
    [key: string]: Stop;
  };

  type RouteShort = {
    route_id: string;
    agency_id?: string;
    route_short_name: string;
    route_long_name?: string;
    route_desc?: string;
    route_type: string;
    route_url?: string;
    route_color?: string;
    route_text_color?: string;
    route_sort_order?: string;
  };

  type RouteLong = {
    route_id: string;
    agency_id?: string;
    route_short_name?: string;
    route_long_name: string;
    route_desc?: string;
    route_type: string;
    route_url?: string;
    route_color?: string;
    route_text_color?: string;
    route_sort_order?: string;
  };

  type RoutesShort = {
    [key: string]: RouteShort;
  };

  type RoutesLong = {
    [key: string]: RouteLong;
  };

  type UploadFile = {
    uid: string;
    size: number;
    name: string;
    fileName?: string;
    lastModified?: number;
    lastModifiedDate?: Date;
    url?: string;
    status?: UploadFileStatus;
    percent?: number;
    thumbUrl?: string;
    originFileObj?: File;
    response?: any;
    error?: any;
    linkProps?: any;
    type: string;
    decompressed?: DecompressedGTFSFile;
  };

  type GTFSFile = {
    agency?: Object;
    stops?: Stops;
    routes?: RoutesShort | RoutesLong;
    trips?: Object;
    stop_times?: Object;
    calendar?: Calendars;
    calendar_dates?: CalendarDates;
    fare_attributes?: Object;
    fare_rules?: Object;
    shapes?: Object;
    frequencies?: Object;
    transfers?: Object;
    feed_info?: Object;
  };

  type GTFSFileNames =
    | 'agency'
    | 'stops'
    | 'routes'
    // 'trips' |
    // 'stop_times' |
    | 'calendar'
    | 'calendar_dates'
    | 'fare_attributes'
    | 'fare_rules'
    // 'shapes' |
    | 'frequencies'
    | 'transfers'
    | 'feed_info';

  type DecompressedGTFSFile = {
    agency?: string;
    stops?: string;
    routes?: string;
    trips?: string;
    stop_times?: string;
    calendar?: string;
    calendar_dates?: string;
    fare_attributes?: string;
    fare_rules?: string;
    shapes?: string;
    frequencies?: string;
    transfers?: string;
    feed_info?: string;
  };

  type UploadFileStatus = 'error' | 'success' | 'done' | 'uploading' | 'removed';

  type MapProvider = 'google' | 'osm' | 'mapbox';

  type LatLng = [ number, number ]
  type Bounds = [ LatLng, LatLng ]

  interface AllInOneMarkerProps {
    title: string;
    position: [number, number];
    label?: string;
    withLabel?: boolean;
    draggable?: boolean;
    animation?: 'DROP' | 'BOUNCE';
    markerEvtHandlers?: MarkerEvtHandlersType;
  }

  interface GoogleMapsLoaderInputProps {
    apiKey?: string;
    callback?: string;
    channel?: string;
    clientID?: string;
    language?: string;
    libraries?: string[];
    region?: string;
    url?: string;
    version?: string;
  }

  interface AllInOneMapProps extends GoogleMapsLoaderInputProps {
    backgroundColor?: string;
    center?: [number, number];
    gestureHandling?: GestureHandlingType;
    gmMaptype?: MapTypeId;
    mapboxStyle?: string;
    mapboxToken?: string;
    gmMapEvtHandlers?: gmMapEvtHandlersType
    osmMapEvtHandlers?: osmMapEvtHandlersType
    mapboxMapEvtHandlers?: mapboxMapEvtHandlersType
    mapStyle?: React.CSSProperties;
    markerClustering?: boolean;
    osmTileLayerServer?: string;
    zoom?: number;
  }

  type gmMapEvtHandlersType = { [evtName: string]: (map: google.maps.Map) => void; };

  type osmMapEvtHandlersType = { [evtName: string]: (map: L.Map) => void; };

  type mapboxMapEvtHandlersType = { [evtName: string]: (map: mapboxgl.Map) => void; };

  type MarkersListType = Array<AddMarkerToListInputType>;

  type AddMarkerToListInputType = { id: string; props: AllInOneMarkerProps };

  type Marker = google.maps.Marker | L.Marker | mapboxgl.Marker

  type MarkerEvtNameType =
    'onClick' |
    'onDblclick' |
    'onDrag' |
    'onDragend' |
    'onDragstart' |
    'onMousedown' |
    'onMouseout' |
    'onMouseover' |
    'onMouseup' |
    'onRightclick'

  type MarkerEvtHandlersType = {
    onClick?: (marker?: Marker) => void;
    onDblclick?: (marker?: Marker) => void;
    onDrag?: (marker?: Marker) => void;
    onDragend?: (marker?: Marker) => void;
    onDragstart?: (marker?: Marker) => void;
    onMousedown?: (marker?: Marker) => void;
    onMouseout?: (marker?: Marker) => void;
    onMouseover?: (marker?: Marker) => void;
    onMouseup?: (marker?: Marker) => void;
    onRightclick?: (marker?: Marker) => void,
  };

  interface GlobalContextInterface {
    state: GlobalContextState,
    dispatch: GlobalContextDispatch,
  }

  type GlobalContextState = {
    bounds: Bounds
    center: LatLng
    currentCenter: LatLng
    fitBounds: boolean
    gmBounds?: google.maps.LatLngBounds
    gmMap?: google.maps.Map
    google?: typeof google
    mapboxMap?: mapboxgl.Map
    mapCardWidth?: number
    mapProps: AllInOneMapProps,
    mapProvider: 'google' | 'osm' | 'mapbox'
    markersList: MarkersListType
    osmMap?: L.Map
    recenterMap: boolean
    zoom: number
  }

  type GlobalContextDispatch = (a: Action) => void

  type Action =
    Action.ADD_MARKER |
    Action.ADD_MARKERS |
    Action.CHANGE_CURRENT_CENTER |
    Action.CHANGE_GM_BOUNDS |
    Action.CHANGE_MAP_CARD_WIDTH |
    Action.CHANGE_MAP_PROVIDER |
    Action.CHANGE_MARKER_POSITION |
    Action.CHANGE_ZOOM |
    Action.FIT_BOUNDS |
    Action.LOAD_GM_API |
    Action.LOAD_MAPS_PROPS |
    Action.ON_FIT_BOUNDS |
    Action.ON_RECENTER_MAP |
    Action.RESIZE_MAPBOX_MAP |
    Action.RESIZE_OSM_MAP |
    Action.RECENTER_MAP |
    Action.REMOVE_MARKER |
    Action.SET_DEFAULT_CENTER |
    Action.SET_DEFAULT_ZOOM |
    Action.SET_GM_MAP |
    Action.SET_MAPBOX_MAP |
    Action.SET_OSM_MAP

  namespace Action {
    export type ADD_MARKER = { type: 'ADD_MARKER', payload: AddMarkerToListInputType }
    export type ADD_MARKERS = { type: 'ADD_MARKERS', payload: MarkersListType }
    export type CHANGE_CURRENT_CENTER = { type: 'CHANGE_CURRENT_CENTER', payload: LatLng }
    export type CHANGE_GM_BOUNDS = { type: 'CHANGE_GM_BOUNDS', payload: google.maps.LatLngBounds }
    export type CHANGE_MAP_CARD_WIDTH = { type: 'CHANGE_MAP_CARD_WIDTH', payload: number }
    export type CHANGE_MAP_PROVIDER = { type: 'CHANGE_MAP_PROVIDER', payload: MapProvider }
    export type CHANGE_MARKER_POSITION = { type: 'CHANGE_MARKER_POSITION', payload: { id: string, newPosition: LatLng } }
    export type CHANGE_ZOOM = { type: 'CHANGE_ZOOM', payload: number }
    export type FIT_BOUNDS = { type: 'FIT_BOUNDS' }
    export type LOAD_GM_API = { type: 'LOAD_GM_API', payload: typeof google }
    export type LOAD_MAPS_PROPS = { type: 'LOAD_MAPS_PROPS', payload: AllInOneMapProps }
    export type ON_FIT_BOUNDS = { type: 'ON_FIT_BOUNDS' }
    export type ON_RECENTER_MAP = { type: 'ON_RECENTER_MAP' }
    export type RECENTER_MAP = { type: 'RECENTER_MAP' }
    export type REMOVE_MARKER= { type: 'REMOVE_MARKER', payload: string }
    export type RESIZE_MAPBOX_MAP= { type: 'RESIZE_MAPBOX_MAP' }
    export type RESIZE_OSM_MAP= { type: 'RESIZE_OSM_MAP' }
    export type SET_DEFAULT_CENTER= { type: 'SET_DEFAULT_CENTER', payload: LatLng }
    export type SET_DEFAULT_ZOOM = { type: 'SET_DEFAULT_ZOOM', payload: number }
    export type SET_GM_MAP = { type: 'SET_GM_MAP', payload: google.maps.Map }
    export type SET_MAPBOX_MAP = { type: 'SET_MAPBOX_MAP', payload: mapboxgl.Map }
    export type SET_OSM_MAP = { type: 'SET_OSM_MAP', payload: L.Map }

  }
}

declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.png' {
  const content: any;
  export default content;
}
