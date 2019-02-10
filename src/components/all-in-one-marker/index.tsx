import React, { FunctionComponent } from 'react';
import { AllInOneMarkerProps } from 'typings';

export const AllInOneMarker: FunctionComponent<AllInOneMarkerProps> = (props) => {
  return <div>{props.children}</div>
}
