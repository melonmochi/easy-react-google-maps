import React, { FunctionComponent, useContext } from 'react';
import {
  Avatar,
  Card,
  List,
} from 'antd';
import { List as VList, ListRowProps, AutoSizer } from 'react-virtualized';
import { stringToColour } from 'utils';
import './style';
import { GlobalContext } from 'components';

export const StopsList: FunctionComponent = () => {
  const { state, dispatch } = useContext(GlobalContext)
  const { markersList, selectedMarker } = state
  const handleOnClickListItem = (key: string) => {
      dispatch({type: 'SELECT_MARKER', payload: key })
  }
  const handleOnDblClickListItem = (key: string) => {
    const currentMarker = markersList.find( x=> x.id === key)
    if(currentMarker) {
      dispatch({ type: 'FOCUS_MARKER', payload: key })
    }
  }
  const rowRenderer = (props: ListRowProps) => {
    const stopItem = markersList[props.index];
    const stopFirstChar = stopItem.props.title.substring(0, 3);
    const randomcolor: string = stringToColour(stopItem.props.title);
    const randomavatar = (
      <Avatar
        style={{ backgroundColor: randomcolor }}
        size='large'
      >
        {stopFirstChar}
      </Avatar>
    );
    const itemClassName = selectedMarker? stopItem.id === selectedMarker.id ? 'listItemSelected' : 'listItem': 'listItem';
    return (
      <List.Item
        key={stopItem.id}
        className={itemClassName}
        onClick={() => handleOnClickListItem(stopItem.id)}
        onDoubleClick={() => handleOnDblClickListItem(stopItem.id)}
        extra={<div className="listItemExtra" />}
        style={{ ...props.style, padding: 0 }}
      >
        <List.Item.Meta
          avatar={randomavatar}
          title={<a className="list-item-meta-title">{stopItem.props.title}</a>}
          description={<span className="list-item-meta-description" >{stopItem.id}</span>}
        />
      </List.Item>
    );
  };
  const autoSize = (
    <AutoSizer>
      {({ height, width }: { height: number; width: number }) => {
        return (
          <VList
            // autoHeight
            height={height}
            rowCount={markersList.length}
            rowHeight={49.33}
            rowRenderer={rowRenderer}
            width={width}
            onSelectedStopKey={selectedMarker? selectedMarker.id: undefined}
          />
        )
      }
      }
    </AutoSizer>
  );
  return (
    <Card
      bordered={false}
      style={{ height: '100%' }}
      bodyStyle={{ height: '100%', padding: 0, paddingRight: 0 }}>
      {autoSize}
    </Card>
  );
}
