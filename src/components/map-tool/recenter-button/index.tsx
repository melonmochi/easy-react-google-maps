import React, { useRef, useEffect } from 'react';
import { Button, Tooltip } from 'antd';
import { GlobalContext } from 'src/components/global-context';
import { fromEvent } from 'rxjs';

export const RecenterButton: React.FunctionComponent = () => {
  const { dispatch } = React.useContext(GlobalContext);

  const rcmRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rcmRef && rcmRef.current) {
      const recenterMap$ = fromEvent(rcmRef.current, 'click');
      dispatch({ type: 'SET_RECENTER_MAP_STREAM', payload: recenterMap$ });
    }
  }, []);

  return (
    <Tooltip title="Recenter Map">
      <div ref={rcmRef} style={{ display: 'inline-flex', margin: '12px 12px' }}>
        <Button icon="undo" />
      </div>
    </Tooltip>
  );
};
