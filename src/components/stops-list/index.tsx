import React from 'react';
import { Stop } from 'typings';
import { Avatar, Card, List, Tag } from 'antd';
import { List as VList, ListRowProps, AutoSizer } from 'react-virtualized';
import { stringToColour } from 'utils';
import './style';

interface StopsListProps {
  onLoadedStopsList: Stop[];
  onCheckStops: (newOnCheckedStopsList: Stop[]) => void;
}

interface StopsListState {
  onSelectedStopKey?: string;
}

export default class StopsList extends React.PureComponent<StopsListProps, StopsListState> {
  state = {
    onSelectedStopKey: undefined,
  };

  handleOnCheck = (keys: string[]) => {
    const { onLoadedStopsList, onCheckStops } = this.props;
    const onShownStops = onLoadedStopsList.filter((stop: Stop) => keys.includes(stop.stop_id));
    onCheckStops(onShownStops);
  };

  handleOnClickListItem = (_e: any, key: string) => {
    this.setState({
      onSelectedStopKey: key,
    });
  };

  rowRenderer = (props: ListRowProps) => {
    const { onSelectedStopKey } = this.state;
    const { onLoadedStopsList } = this.props;
    const stopItem = onLoadedStopsList[props.index];
    const stopFirstChar = stopItem.stop_name.substring(0, 3);
    const randomcolor: string = stringToColour(stopItem.stop_name);
    const randomavatar = (
      <Avatar style={{ backgroundColor: randomcolor, verticalAlign: 'middle' }} size="default">
        {stopFirstChar}
      </Avatar>
    );
    const itemClassName = props.key === onSelectedStopKey ? 'listItemSelected' : 'listItem';
    return (
      <List.Item
        key={props.key}
        className={itemClassName}
        onClick={e => this.handleOnClickListItem(e, props.key)}
        extra={<div className="listItemExtra" />}
        style={{ ...props.style, padding: 0 }}
        actions={[<a key="edit">edit</a>, <a key="more">more</a>]}
      >
        <List.Item.Meta
          avatar={randomavatar}
          title={<a className="listItemMetaTitle">{stopItem.stop_name}</a>}
          description={
            <span>
              <Tag>{stopItem.stop_id}</Tag>
              {stopItem.stop_code ? <Tag>{stopItem.stop_code}</Tag> : null}
            </span>
          }
        />
      </List.Item>
    );
  };

  render() {
    /*const defaultCheckedKeys = this.props.onLoadedStopsList.map( (stop: Stop) => {
      return stop.stop_id;
    });*/

    const { onLoadedStopsList } = this.props;
    const { onSelectedStopKey } = this.state;

    const autoSize = (
      <AutoSizer>
        {({ height, width }: { height: number; width: number }) => (
          <VList
            // autoHeight
            height={height}
            rowCount={onLoadedStopsList.length}
            rowHeight={49.33}
            rowRenderer={this.rowRenderer}
            width={width}
            onSelectedStopKey={onSelectedStopKey}
          />
        )}
      </AutoSizer>
    );

    return (
      <Card style={{ height: '100%' }} bodyStyle={{ height: '100%', padding: 8, paddingRight: 0 }}>
        {autoSize}
      </Card>
    );
  }
}
