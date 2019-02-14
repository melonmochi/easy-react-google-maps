import React, { FunctionComponent, createContext, useReducer } from 'react';
import { GlobalContextInterface, GlobalContextState as State } from 'typings';
import { reducers, defaultPosition, defaultZoom } from 'utils';

const initialState: State = {
  fitBounds: false,
  mapView: { center: defaultPosition, zoom: defaultZoom },
  mapProps: {},
  markersList: [],
  mapProvider: 'google',
};

export const GlobalContext = createContext<GlobalContextInterface>({
  state: initialState,
  dispatch: () => {},
});

export const GlobalContextProvider: FunctionComponent = props => {
  const [state, dispatch] = useReducer(reducers, initialState);

  console.log(state);

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>{props.children}</GlobalContext.Provider>
  );
};
