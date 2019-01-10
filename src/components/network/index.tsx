import React from 'react';
import { Tree, Icon } from 'antd';
import { Stop, RoutesShort, RoutesLong } from 'typings';
const { TreeNode } = Tree;

interface NetworkListProps {
  onLoadedStops: Stop[];
  onLoadedRoutes?: RoutesShort | RoutesLong;
  onCheckStopsList: any;
}

interface NetworkListState {
  showStopsList: boolean;
  showRoutesList: boolean;
}

export default class NetworkList extends React.Component<NetworkListProps, NetworkListState> {
  state = {
    showStopsList: false,
    showRoutesList: false,
  };

  handleOnCheck = (keys: string[]) => {
    this.props.onCheckStopsList(!keys.includes('net-stops'));
  };

  render() {
    return (
      <Tree checkable showIcon onCheck={this.handleOnCheck}>
        <TreeNode title="Stops" key="net-stops" icon={<Icon type="home" />} />
        <TreeNode title="Routes" key="net-routes" icon={<Icon type="branches" />} />
      </Tree>
    );
  }
}
