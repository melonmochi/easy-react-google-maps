import React, { FunctionComponent, useContext, useRef, useEffect } from 'react';
import { Avatar, Card, List, Tooltip } from 'antd';
import { List as VList, ListRowProps, AutoSizer } from 'react-virtualized';
import { stringToColour } from 'utils';
import './style';
import { GlobalContext } from 'components';
import { setMarkerItemStream } from './utils';

const RowRenderer: FunctionComponent<ListRowProps> = props => {
  const { state, dispatch } = useContext(GlobalContext);
  const { markersList, selectedMarker } = state;
  const markerItemRef = useRef<HTMLDivElement>(null);
  const stopItem = markersList[props.index];
  const stopFirstChar = stopItem.props.title.substring(0, 3);
  const randomcolor: string = stringToColour(stopItem.props.title);
  const randomavatar = (
    <Avatar style={{ backgroundColor: randomcolor }} size="large">
      {stopFirstChar}
    </Avatar>
  );
  useEffect(() => {
    if (markerItemRef && markerItemRef.current) {
      const m$ = setMarkerItemStream(markerItemRef.current);
      dispatch({
        type: 'SET_MARKER_ITEM_STREAM',
        payload: { [stopItem.id]: m$ },
      });
    }
  }, []);
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
          />
        );
      }}
    </AutoSizer>
  );
  return (
    <Card
      bordered={false}
      style={{ height: '100%' }}
      bodyStyle={{ height: '100%', padding: 0, paddingRight: 0 }}
    >
      {autoSize}
    </Card>
  );
};
