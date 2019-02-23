declare module 'typings' {
  import { Observable } from "rxjs";
  import { Color } from "csstype";

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

  type Calendars = { [key: string]: Calendar };
  type CalendarDate = {
    service_id: string;
    date: string;
    exception_type: string;
  };
  type CalendarDates = { [key: string]: CalendarDate };
  type MapTypeId = 'HYBRID' | 'ROADMAP' | 'SATELLITE' | 'TERRAIN'
  type GestureHandlingType = 'cooperative' | 'greedy' | 'none' | 'auto';

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

  type Stops = {[key: string]: Stop};

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

  type RoutesShort = { [key: string]: RouteShort };
  type RoutesLong = { [key: string]: RouteLong };

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

  type AddMarkerToListInputType = { id: string; props: AllInOneMarkerProps };
  type Bounds = [ LatLng, LatLng ]
  type LatLng = [ number, number ]
  type MapProvider = 'google' | 'osm' | 'mapbox';
  type MapView = { center: LatLng, zoom: number }
  type Marker = google.maps.Marker | L.Marker | mapboxgl.Marker
  type MarkersListType = Array<AddMarkerToListInputType>;
  type UploadFileStatus = 'error' | 'success' | 'done' | 'uploading' | 'removed';
  type gmMapEvtHandlersType = { [evtName: string]: (map: google.maps.Map) => void; };
  type mapboxMapEvtHandlersType = { [evtName: string]: (map: mapboxgl.Map) => void; };
  type osmMapEvtHandlersType = { [evtName: string]: (map: L.Map) => void; };


  type GmMarkerAnimationType = 'DROP' | 'BOUNCE'
  interface AllInOneMarkerProps {
    title: string;
    position: [number, number];
    label?: string;
    withLabel?: boolean;
    draggable?: boolean;
    animation?: GmMarkerAnimationType;
    markerEvtHandlers?: MarkerEvtHandlersType;
    color?: Color;
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

  type EvtStreamType = { [e: string]: Observable<{}> }
  type handleMapEventInput = {
    e: string,
    dispatch: GlobalContextDispatch,
    center: LatLng,
    markersBounds?: Bounds,
    searchBoxPlacesBounds?: Bounds,
  }
  type setMapConfigInput = {
    center: LatLng,
    zoom: number,
  }
  type setMarkerConfigInput = {
    title: string,
    position: LatLng,
    draggable?: boolean,
  }
  type handleMarkerEventInput = {
    evt: string,
    id: string,
    position: LatLng,
    ifselected: boolean,
    dispatch: GlobalContextDispatch
  }

  type GlobalContextState = {
    center: LatLng
    google?: typeof google
    mapCardWidth?: number
    mapProps: AllInOneMapProps
    mapProvider: 'google' | 'osm' | 'mapbox'
    mapTools$: EvtStreamType
    mapView: MapView
    markersBounds?: Bounds
    markersList: MarkersListType
    selectedMarker?: AddMarkerToListInputType
    searchBoxPlacesBounds?: Bounds
    zoom: number
  }

  type GlobalContextDispatch = (a: Action) => void

  type Action =
    Action.ADD_MARKER |
    Action.ADD_MARKERS |
    Action.CHANGE_MAP_CARD_WIDTH |
    Action.CHANGE_MAP_PROVIDER |
    Action.CHANGE_MARKER_POSITION |
    Action.LOAD_GM_API |
    Action.LOAD_MAPS_PROPS |
    Action.REMOVE_MARKER |
    Action.SELECT_MARKER |
    Action.SET_MAP_TOOL_STREAM |
    Action.SET_SEARCH_BOX_PLACES_BOUNDS |
    Action.SET_VIEW

  namespace Action {
    export type ADD_MARKER = { type: 'ADD_MARKER', payload: AddMarkerToListInputType }
    export type ADD_MARKERS = { type: 'ADD_MARKERS', payload: MarkersListType }
    export type CHANGE_MAP_CARD_WIDTH = { type: 'CHANGE_MAP_CARD_WIDTH', payload: number }
    export type CHANGE_MAP_PROVIDER = { type: 'CHANGE_MAP_PROVIDER', payload: MapProvider }
    export type CHANGE_MARKER_POSITION = { type: 'CHANGE_MARKER_POSITION', payload: { id: string, newPosition: LatLng } }
    export type LOAD_GM_API = { type: 'LOAD_GM_API', payload: typeof google }
    export type LOAD_MAPS_PROPS = { type: 'LOAD_MAPS_PROPS', payload: AllInOneMapProps }
    export type REMOVE_MARKER= { type: 'REMOVE_MARKER', payload: string }
    export type SELECT_MARKER = { type: 'SELECT_MARKER', payload: string }
    export type SET_MAP_TOOL_STREAM = { type: 'SET_MAP_TOOL_STREAM', payload: EvtStreamType}
    export type SET_SEARCH_BOX_PLACES_BOUNDS = { type: 'SET_SEARCH_BOX_PLACES_BOUNDS', payload: Bounds }
    export type SET_VIEW = { type: 'SET_VIEW', payload: MapView }
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
