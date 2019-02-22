import React, { FunctionComponent, useEffect, useState, useContext } from 'react';
import { Input, Icon } from 'antd';
import { GlobalContext } from 'src/components/global-context';
import { loadGmSearchBoxEventsStream, handleGmSearchBoxEvent } from 'gm';
import { EvtStreamType } from 'typings';
import { Subscription } from 'rxjs';
const { Search } = Input

export interface SearchBoxProps {
  google: typeof google;
}

export const SearchBox: FunctionComponent<SearchBoxProps> = props => {
  const { google } = props
  const { dispatch } = useContext(GlobalContext)
  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);
  const [searchBoxEvents$, setSearchBoxEvents$] = useState<EvtStreamType>({});

  useEffect(() => {
    const input = document.getElementById('search-box-input') as HTMLInputElement;
    if (input) {
      const sb = new google.maps.places.SearchBox(input);
      setSearchBox(sb)
      setSearchBoxEvents$(loadGmSearchBoxEventsStream(sb))
    }
  }, [])

  useEffect(() => {
    let evtSubsc: Array<Subscription> = [];
    if (searchBox) {
      evtSubsc = Object.keys(searchBoxEvents$).map(e =>
        searchBoxEvents$[e].subscribe(() => handleGmSearchBoxEvent({ e, searchBox, dispatch }))
      );
    };
    return () => evtSubsc.forEach(s => s.unsubscribe());
  }, [searchBoxEvents$])

  return <Search
    id='search-box-input'
    className='search-box-input'
    size='large'
    placeholder="Input where you want to go"
    enterButton
    prefix={<Icon type="compass" style={{ color: 'rgba(0,0,0,.25)' }} />}
    style={{ width: '300px' }}
  />
}
