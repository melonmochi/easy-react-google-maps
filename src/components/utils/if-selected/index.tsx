import { AddMarkerToListInputType } from 'typings';

export const ifSelected = (i: string, selectM?: AddMarkerToListInputType) => {
  if (selectM) {
    return selectM.id === i ? true : false;
  } else {
    return false;
  }
};
