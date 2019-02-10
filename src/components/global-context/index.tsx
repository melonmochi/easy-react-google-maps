import React, { FunctionComponent, createContext, useReducer } from 'react';
import {
  GlobalContextInterface,
  GlobalContextState as State,
} from 'typings';
import { reducers } from 'utils';

const initialState: State = {
  bounds: [[40.416778, -3.703778], [40.416778, -3.703778]],
  center: [40.416778, -3.703778],
  currentCenter: [40.416778, -3.703778],
  mapProps: {},
  markersList: [],
  mapProvider: 'google',
  zoom: 14,
};

export const GlobalContext = createContext<GlobalContextInterface>({
  state: initialState,
  dispatch: () => { },
})

export const GlobalContextProvider: FunctionComponent = (props) => {

  const [state, dispatch] = useReducer(reducers, initialState);

  return (
    <GlobalContext.Provider
      value={{ state, dispatch }}
    >
      {props.children}
    </GlobalContext.Provider>
  )
}
