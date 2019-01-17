import * as React from 'react';
import { googleMapsURLStringify } from './googleMapsURLStringify';
import { googleMapsScriptLoader } from './googleMapsScriptLoader';
// const scriptjs = require('scriptjs')

// tslint:disable-next-line:interface-name
export interface GoogleMapsLoaderInputProps {
  apiKey?: string;
  callback?: string;
  channel?: string;
  clientID?: string;
  language?: string;
  libraries?: string[];
  region?: string;
  url?: string;
  version?: string;
}

// tslint:disable-next-line:interface-name
export interface GoogleMapsLoaderState {
  google?: typeof google;
}

export const GoogleMapsApiLoader = (loaderInput: GoogleMapsLoaderInputProps) => (
  WrappedComponent: React.ComponentType
) =>
  class GoogleMaps extends React.Component<any, GoogleMapsLoaderState> {
    state: Readonly<GoogleMapsLoaderState> = {
      google: undefined,
    };

    handleloaded(googleApi: typeof google) {
      this.setState({
        google: googleApi,
      });
    }

    componentDidMount() {
      const googleMapsURL = googleMapsURLStringify(loaderInput);
      if (!window.google) {
        googleMapsScriptLoader(googleMapsURL).then((googleApi: typeof google) =>
          this.handleloaded(googleApi)
        );
      } else {
        this.handleloaded(window.google);
      }
    }

    public render() {
      const props = Object.assign({}, this.props, {
        google: this.state.google,
      });

      return props.google ? (
        <div>
          <WrappedComponent {...props} />
        </div>
      ) : null;
    }
  };

export default GoogleMapsApiLoader;
