import * as React from 'react';
import { Button, Tooltip } from 'antd';
import { GlobalContext } from 'src/components/global-context';

export const FitBoundsButton: React.FunctionComponent = () => {
  const { dispatch } = React.useContext(GlobalContext)
  const handleClick = () => {
    dispatch({type:'FIT_BOUNDS'})
  };

  return (
    <Tooltip title="Fit Bounds">
      <Button onClick={handleClick} style={{ margin: '12px 12px' }} icon="arrows-alt" />
    </Tooltip>
  );
}
