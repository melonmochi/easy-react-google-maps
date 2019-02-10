import * as React from 'react';
import { Card } from 'antd';
import { RecenterButton } from './recenter-button';
import { FitBoundsButton } from './fit-bounds-button';

export const MapTool: React.FunctionComponent = () => {
  return (
    <Card style={{ width: 'auto' }} bordered={false}>
      <RecenterButton />
      <FitBoundsButton />
    </Card>
  )
}
