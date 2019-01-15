import React from 'react';
import { Stop } from 'typings';
import { Tree, Icon } from 'antd';
const { TreeNode } = Tree;

interface StopsListProps {
  onLoadedStopsList: Stop[];
  onCheckStops: any;
}

export default class StopsList extends React.PureComponent<StopsListProps, any> {
  handleOnCheck = (keys: string[]) => {
    const { onLoadedStopsList, onCheckStops } = this.props;
    const onShownStops = onLoadedStopsList.filter((stop: Stop) => keys.includes(stop.stop_id));
    onCheckStops(onShownStops);
  };

  render() {
    const { onLoadedStopsList } = this.props;

    const stopsTreeNode = onLoadedStopsList.map((stop: Stop) => {
      return <TreeNode title={stop.stop_name} key={stop.stop_id} />;
    });

    const defaultCheckedKeys = onLoadedStopsList.map((stop: Stop) => {
      return stop.stop_id;
    });

    return (
      <Tree
        checkable
        showIcon
        defaultExpandAll
        defaultCheckedKeys={defaultCheckedKeys}
        onCheck={this.handleOnCheck}
      >
        <TreeNode title="Stops" key="net-stops" icon={<Icon type="home" />}>
          {stopsTreeNode}
        </TreeNode>
      </Tree>
    );
  }
}
