import * as React from 'react';
import { Button, Tooltip } from 'antd';
import { GlobalContext } from 'src/components/global-context';

export const RecenterButton: React.FunctionComponent = () => {
  const { dispatch } = React.useContext(GlobalContext);

  const handleClick = () => {
    dispatch({ type: 'RECENTER_MAP' });
  };

  return (
    <Tooltip title="Recenter Map">
      <Button onClick={handleClick} style={{ margin: '12px 12px' }} icon="undo" />
    </Tooltip>
  );
};
