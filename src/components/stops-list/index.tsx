import React from 'react';
import { Stop } from 'typings';
import { Avatar, List } from 'antd';
import { List as VList, ListRowProps, AutoSizer } from 'react-virtualized';
import randomColor from 'randomcolor';

interface StopsListProps {
  onLoadedStopsList: Stop[];
  onCheckStops: (newOnCheckedStopsList: Stop[]) => void;
}

export default class StopsList extends React.Component<StopsListProps, any> {
  handleOnCheck = (keys: string[]) => {
    const { onLoadedStopsList, onCheckStops } = this.props;
    const onShownStops = onLoadedStopsList.filter((stop: Stop) => keys.includes(stop.stop_id));
    onCheckStops(onShownStops);
  };

  rowRenderer = (props: ListRowProps) => {
    const { onLoadedStopsList } = this.props;
    const stopItem = onLoadedStopsList[props.index];
    const stopFirstChar = stopItem.stop_name.charAt(0);
    const randomcolor: string = randomColor();
    const randomavatar = (
      <Avatar style={{ backgroundColor: randomcolor }} size="small">
        {stopFirstChar}
      </Avatar>
    );
    return (
      <List.Item key={props.key} style={props.style}>
        <List.Item.Meta
          avatar={randomavatar}
          title={stopItem.stop_id}
          description={stopItem.stop_code}
        />
        <div>{stopItem.stop_name}</div>
      </List.Item>
    );
  };

  render() {
    /*const defaultCheckedKeys = this.props.onLoadedStopsList.map( (stop: Stop) => {
      return stop.stop_id;
    });*/

    const { onLoadedStopsList } = this.props;

    const autoSize = (
      <AutoSizer>
        {({ height, width }: { height: number; width: number }) => (
          <VList
            height={height}
            rowCount={onLoadedStopsList.length}
            rowHeight={40}
            rowRenderer={this.rowRenderer}
            width={width}
          />
        )}
      </AutoSizer>
    );

    return autoSize;
  }
}
