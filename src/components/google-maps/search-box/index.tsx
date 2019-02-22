import './style'
import React, { FunctionComponent, useRef, useEffect, useState } from 'react';
import { GoogleMapsControlPosition, EvtStreamType } from 'typings';
import { Subscription } from 'rxjs';
import { loadGmSearchBoxEventsStream, handleGmSearchBoxEvent } from 'gm';

export interface SearchBoxProps {
  google: typeof google;
  map: google.maps.Map;
  position?: GoogleMapsControlPosition;
}

export const SearchBox: FunctionComponent<SearchBoxProps> = props => {
  const { google, map, position } = props
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
  const [searchBoxEvents$, setSearchBoxEvents$] = useState<EvtStreamType>({});

  useEffect(() => {
    if (inputRef.current) {
      const sb = createSearchBox(inputRef.current)
      setSearchBox(sb)
      setSearchBoxEvents$(loadGmSearchBoxEventsStream(sb))
      const pos = position ? position : 'TOP_LEFT';
      map.controls[google.maps.ControlPosition[pos]].push(inputRef.current);
    }
  }, [])

  useEffect(() => {
    let evtSubsc: Array<Subscription> = [];
    if(searchBox) {
      evtSubsc = Object.keys(searchBoxEvents$).map(e =>
        searchBoxEvents$[e].subscribe(() => handleGmSearchBoxEvent({ e, map, searchBox }))
      );
    }
    return () => evtSubsc.forEach(s => s.unsubscribe());
  },[searchBoxEvents$])

  const createSearchBox = (input: HTMLInputElement) => new google.maps.places.SearchBox(
    input);

  return (
    <input
      ref={inputRef}
      type="text"
      className="search-box-input"
    />
  );
}
