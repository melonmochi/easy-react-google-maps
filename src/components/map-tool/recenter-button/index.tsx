import React, { useRef, useEffect } from 'react';
import { Button, Tooltip } from 'antd';
import { GlobalContext } from 'src/components/global-context';
import { fromEvent, Observable } from 'rxjs';

export const RecenterButton: React.FunctionComponent = () => {
  const { dispatch } = React.useContext(GlobalContext);

  const rcmRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rcmRef && rcmRef.current) {
      const recenterMap$ = fromEvent(rcmRef.current, 'click');
      dispatch({
        type: 'SET_MAP_TOOL_STREAM',
        payload: { recenter_map: recenterMap$ },
      });
    }
    return () => {
      dispatch({
        type: 'SET_MAP_TOOL_STREAM',
        payload: { fit_bounds: new Observable() },
      });
    };
  }, []);

  return (
    <Tooltip title="Recenter Map">
      <div ref={rcmRef} style={{ display: 'inline-flex', margin: '12px 12px' }}>
        <Button icon="undo" />
      </div>
    </Tooltip>
  );
};
