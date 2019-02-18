import React, { useEffect, useRef } from 'react';
import { Button, Tooltip } from 'antd';
import { GlobalContext } from 'src/components/global-context';
import { fromEvent } from 'rxjs';

export const FitBoundsButton: React.FunctionComponent = () => {
  const { dispatch } = React.useContext(GlobalContext);

  const fbbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fbbRef && fbbRef.current) {
      const fitBounds$ = fromEvent(fbbRef.current, 'click');
      dispatch({ type: 'SET_FIT_BOUNDS_STREAM', payload: fitBounds$ });
    }
  }, []);

  return (
    <Tooltip title="Fit Bounds">
      <div ref={fbbRef} style={{ display: 'inline-flex', margin: '12px 12px' }}>
        <Button icon="arrows-alt" />
      </div>
    </Tooltip>
  );
};
