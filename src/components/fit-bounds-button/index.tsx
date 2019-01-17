import * as React from 'react';
import { Button, Tooltip } from 'antd';

// tslint:disable-next-line:interface-name
export interface FitBoundsButtonProps {
  fitBounds: () => void;
}

export default class FitBoundsButton extends React.Component<FitBoundsButtonProps, any> {
  handleClick = () => {
    const { fitBounds } = this.props;
    fitBounds();
  };

  render() {
    return (
      <Tooltip title="Fit Bounds">
        <Button onClick={this.handleClick} style={{ margin: '12px 12px' }} icon="arrows-alt" />
      </Tooltip>
    );
  }
}
