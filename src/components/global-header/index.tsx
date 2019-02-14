import React, { FunctionComponent } from 'react';
import logo from 'src/assets/logo.svg';
import './style';

export const GlobalHeader: FunctionComponent = () => {
  return (
    <div className="global-header">
      <div className="global-header-logo" key="logo">
        <img src={logo} alt="logo" width="64" />
      </div>
      <nav className="global-header-nav">
        <a className="global-header-navItem">Maps</a>
      </nav>
    </div>
  );
};
