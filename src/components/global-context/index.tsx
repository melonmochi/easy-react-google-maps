import React, { FunctionComponent, createContext, useReducer } from 'react';
import { GlobalContextInterface, GlobalContextState as State } from 'typings';
import { reducers, defaultZoom, defaultCenter } from 'utils';

const initialState: State = {
  center: defaultCenter,
  mapView: { center: defaultCenter, zoom: defaultZoom },
  mapProps: {},
  mapTools$: {},
  markerItem$: {},
  markersList: [],
  mapProvider: 'google',
  zoom: defaultZoom,
};

export const GlobalContext = createContext<GlobalContextInterface>({
  state: initialState,
  dispatch: () => {},
});

export const GlobalContextProvider: FunctionComponent = props => {
  const [state, dispatch] = useReducer(reducers, initialState);
  return (
    <GlobalContext.Provider value={{ state, dispatch }}>{props.children}</GlobalContext.Provider>
  );
};
