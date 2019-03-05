import React, { FunctionComponent, useContext, useRef, useEffect, useState } from 'react';
import { Avatar, Card, List, Tooltip, Input } from 'antd';
import { List as VList, ListRowProps, AutoSizer } from 'react-virtualized';
import { stringToColour } from 'utils';
import './style';
import { GlobalContext } from 'components';
import { setMarkerItemStream, handleMarkerItemEvt } from './utils';
import { EvtStreamType } from 'typings';
import { Subscription } from 'rxjs';

const { Search } = Input

const RowRenderer: FunctionComponent<ListRowProps> = props => {
  const { state, dispatch } = useContext(GlobalContext);
  const { markersList, selectedMarker } = state;
  const markerItemRef = useRef<HTMLDivElement>(null);
  const stopItem = markersList[props.index];
  const stopFirstChar = stopItem.props.title.substring(0, 3);
  const randomcolor: string = stringToColour(stopItem.props.title);

  const [ markerItem$, setMarkerItem$ ] = useState<EvtStreamType>({})

  const randomavatar = (
    <Avatar style={{ backgroundColor: randomcolor }} size="large">
      {stopFirstChar}
    </Avatar>
  );
  useEffect(() => {
    if (markerItemRef && markerItemRef.current) {
      const m$ = setMarkerItemStream(markerItemRef.current);
      setMarkerItem$(m$)
    }
  }, [markerItemRef.current]);

  useEffect(() => {
    let evtSubsc: Array<Subscription> = [];
    evtSubsc = Object.keys(markerItem$).map(e =>
      markerItem$[e].subscribe(() => {
        handleMarkerItemEvt({ e, dispatch, id: stopItem.id, position: stopItem.props.position })
      })
    );
    return () => {
      evtSubsc.forEach(s => s.unsubscribe());
    };
  },[ markerItem$ ])

  const itemClassName = selectedMarker
    ? stopItem.id === selectedMarker.id
      ? 'listItemSelected'
      : 'listItem'
    : 'listItem';
  return (
    <div ref={markerItemRef} key={stopItem.id} style={{ overflowY: 'auto' }}>
      <Tooltip placement="left" title={stopItem.props.title}>
        <List.Item
          className={itemClassName}
          extra={<div className="listItemExtra" />}
          style={{ ...props.style, padding: 0 }}
        >
          <List.Item.Meta
            avatar={randomavatar}
            title={<a className="list-item-meta-title">{stopItem.props.title}</a>}
            description={<span className="list-item-meta-description">{stopItem.id}</span>}
          />
        </List.Item>
      </Tooltip>
    </div>
  );
};

export const StopsList: FunctionComponent = () => {
  const { state } = useContext(GlobalContext);
  const { markersList, selectedMarker } = state;

  const filteredMarkersList = markersList.filter( m => !m.hide )

  const selMarker = selectedMarker? filteredMarkersList.find(m => m.id === selectedMarker.id): undefined

  const autoSize = (
    <AutoSizer>
      {({ height, width }: { height: number; width: number }) => {
        return (
          <VList
            height={height}
            rowCount={markersList.length}
            rowHeight={49.33}
            rowRenderer={props => <RowRenderer {...props} />}
            width={width}
            onSelectedStopKey={selectedMarker ? selectedMarker.id : undefined}
            scrollToIndex={selMarker ? filteredMarkersList.indexOf(selMarker): undefined}
          />
        );
      }}
    </AutoSizer>
  );

  const handleOnSearch = (value: string) => {
    console.log(value)
  }

  const SearchBar = <Search onSearch={handleOnSearch}/>

  return (
    <Card bordered={false}
    title={SearchBar}
    style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}
    bodyStyle={{ padding: 0, flex: 1 }}>
        {autoSize}
    </Card>
  );
};
