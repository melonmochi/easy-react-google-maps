import React from 'react';
import { Stop } from 'typings';
import { Tree, Icon } from 'antd';
const { TreeNode } = Tree;

interface StopsListProps {
  onLoadedStops: Stop[];
  onCheckStops: any;
}

export default class StopsList extends React.PureComponent<StopsListProps, any> {
  handleOnCheck = (keys: string[]) => {
    const { onLoadedStops, onCheckStops } = this.props;
    const onSelectStops = onLoadedStops.filter((stop: Stop) => keys.includes(stop.stop_id));
    onCheckStops(onSelectStops);
  };

  render() {
    const { onLoadedStops } = this.props;

    const stopsTreeNode = onLoadedStops.map((stop: Stop) => {
      return <TreeNode title={stop.stop_name} key={stop.stop_id} />;
    });

    const defaultCheckedKeys = onLoadedStops.map((stop: Stop) => {
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
