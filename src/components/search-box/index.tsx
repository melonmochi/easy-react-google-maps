import * as React from 'react';
import { GoogleMapsControlPosition } from 'typings';

// tslint:disable-next-line:interface-name
export interface SearchBoxProps {
  google?: typeof google;
  map?: google.maps.Map;
  position?: GoogleMapsControlPosition;
}

export default class SearchBox extends React.Component<SearchBoxProps, any> {
  searchBox: google.maps.places.SearchBox;

  private inputRef = React.createRef<HTMLInputElement>();

  componentDidMount() {
    this.renderSearchBox();
  }

  onPlacesChanged = () => {
    const places = this.searchBox.getPlaces();
    const bounds = new google.maps.LatLngBounds();
    const { map } = this.props;

    if (map && places.length !== 0) {
      places.forEach(place => {
        if (!place.geometry) {
          throw new Error('Returned place contains no geometry');
        } else {
          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        }
      });
      map.fitBounds(bounds);
    }
  };

  renderSearchBox() {
    if (this.props && this.props.google) {
      const { google, map } = this.props;

      const input = this.inputRef.current;
      this.searchBox = new google.maps.places.SearchBox(input as HTMLInputElement);

      const position = this.props.position ? this.props.position : 'TOP_LEFT';

      if (map) {
        map.controls[google.maps.ControlPosition[position]].push(input as HTMLInputElement);
      }

      this.setState({
        markers: [],
      });
      this.searchBox.addListener('places_changed', this.onPlacesChanged);
    }
  }

  render() {
    return (
      <input
        ref={this.inputRef}
        type="text"
        style={{
          border: `1px solid transparent`,
          borderRadius: `3px`,
          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          boxSizing: `border-box`,
          fontSize: `14px`,
          height: `32px`,
          margin: '12px 12px',
          outline: `none`,
          padding: `0 12px`,
          position: 'relative',
          textOverflow: `ellipses`,
          width: `240px`,
        }}
      />
    );
  }
}
