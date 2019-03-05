import React, { FunctionComponent, useContext } from 'react';
import { Card } from 'antd';
import ResizeDetector from 'react-resize-detector';
import { GlobalContext } from '../global-context';
import './style';
import { SearchBox } from 'components';

const MapOptionsList = [
  {
    key: 'osm',
    tab: 'OpenStreetMap',
  },
  {
    key: 'google',
    tab: 'GoogleMaps',
  },
  {
    key: 'mapbox',
    tab: 'Mapbox',
  },
];

export const MapCard: FunctionComponent = props => {
  const { state, dispatch } = useContext(GlobalContext);
  const { google } = state;

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
      extra={google ? <SearchBox google={google} /> : null}
      tabList={MapOptionsList}
      activeTabKey={state.mapProvider}
      onTabChange={onTabChange}
      bordered={false}
      headStyle={{
        display: 'flex',
        flexDirection: 'row-reverse',
        alignSelf: 'flex-start',
        padding: '0 10px',
      }}
      bodyStyle={{ padding: '0' }}
    >
      <ResizeDetector handleWidth onResize={onResize} />
      {renderChildren()}
    </Card>
  );
};
