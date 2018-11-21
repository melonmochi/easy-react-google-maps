A library of Google Maps components with React-based implementation.

English | [Español](./README-es_ES.md)

## ✨ Features

- Supported the lastest versions of Google Maps JavaScript Api
- A set of high-quality React components out of the box.
- Written in TypeScript with predictable static types.

## 🖥 Environment Support

* Modern browsers and Internet Explorer 9+

## 📦 Install

```bash
npm install easy-react-google-maps --save
```
or
```bash
yarn add easy-react-google-maps
```

## 🔨 Usage

```jsx
import * as React from 'react';
import {
  GoogleMapsApiLoader,
  Map,
  Marker,
  SearchBox,
  InfoWindow,
  RecenterButton,
  FitBoundsButton,
} from 'easy-react-google-maps';

export class MapContainer extends React.Component {
  render() {
    return (
      <div>
        <Map
        >
          <Marker
          >
            <InfoWindow />
          </Marker>
          <SearchBox />
          <RecenterButton />
          <FitBoundsButton />
        </Map>
      </div>
    );
  }
}

export default GoogleMapsApiLoader({
  apiKey: LOAD_YOUR_GOOGLE_API_KEY_FROM_A_PRIVATE_FILE,
})(MapContainer);
```

## ⌨️ Development

```bash
$ git clone git@github.com:melonmochi/easy-react-google-maps.git
$ cd easy-react-google-maps
$ npm install
$ npm start
```
Create your own config.ts file in the root directory:

```ts
export const config = {
    apiKey: YOUR_GOOGLE_API_KEY,
}

```
Add this config.ts in .gitignore

```.gitignore
# GoogleApi
/config.ts
```


Open your browser and visit http://127.0.0.1:8080

## 🤝 Contributing [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

We welcome all contributions. 