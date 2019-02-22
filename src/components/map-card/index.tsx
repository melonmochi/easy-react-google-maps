import React, { FunctionComponent, useContext } from 'react';
import { Card } from 'antd';
import ResizeDetector from 'react-resize-detector';
import { GlobalContext } from '../global-context';
import './style';

const MapOptionsList = [
  {
    key: 'google',
    tab: 'GoogleMaps',
  },
  {
    key: 'osm',
    tab: 'OpenStreetMap',
  },
  {
    key: 'mapbox',
    tab: 'Mapbox',
  },
];

export const MapCard: FunctionComponent = props => {
  const { state, dispatch } = useContext(GlobalContext);

  const renderChildren = () => {
    const { children } = props;

    if (!children) {
      return;
    }

    return React.Children.map(children, c => {
      if (!c) {
        return;
      }
      return React.cloneElement(c as React.ReactElement<any>, {
        mapProvider: state.mapProvider,
      });
    });
  };

  const onResize = (w: number) => {
    dispatch({ type: 'CHANGE_MAP_CARD_WIDTH', payload: w });
  };

  const onTabChange = (mp: typeof state['mapProvider']) => {
    dispatch({ type: 'CHANGE_MAP_PROVIDER', payload: mp });
  };

  return (
    <Card
      className="mapCard"
      tabList={MapOptionsList}
      activeTabKey={state.mapProvider}
      onTabChange={onTabChange}
      bordered={false}
      bodyStyle={{ padding: '0', marginTop: '1px' }}
    >
      <ResizeDetector handleWidth onResize={onResize} />
      {renderChildren()}
    </Card>
  );
};
