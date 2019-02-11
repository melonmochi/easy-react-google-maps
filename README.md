A library of responsive maps visualization components with React-based implementation.

English | [Español](./README-es_ES.md)

## ✨ Features

- 📦 **Out of box** with built-in map api: google, leaflet and mapboxgl.
- 🚀 **High performance**, a set of high-quality React components out of the box.
- 🍁 **TypeScript**, written in TypeScript with predictable static types.
- 🚄 **Less code**, 40% less codes due to use of new React Hooks + Functional Components

## 🖥 Environment Support

* Modern browsers and Internet Explorer 9+

## 🏈 Install

*not published yet on NPM*

## 🔨 Usage

```jsx
import React, { FunctionComponent } from 'react';
import {
  Layout,
  Map,
  Marker
} from 'components';

export const EasyMapApp: FunctionComponent = () => {
  return (
    <div className="easyMapApp" style={{ height: '100%' }}>
      <Layout>
        <Map
          language='ja'
          region='JP'
        >
          <Marker
            title="Point A"
            position={[40.416778, -3.703778]}
            draggable
          />
        </Map>
      </Layout>
    </div>
  );
};

export default EasyMapApp;
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
    apiKey: "YOUR_GOOGLE_API_KEY",
}

export const mapboxConfig = {
    token: "YOUR_MAPBOX_API_TOKEN",
}

```
Add this config.ts in .gitignore

```.gitignore
# GoogleApi
/config.ts
```
Open your browser and visit http://127.0.0.1:8080

## 🐠 Preview
![Preview](../assets/preview_ergm.png?raw=true)

## 🗺️ RoadMap
- 🏓 **Interactive mode design** to cover at least basics needs
- 🛵 **RxJS** as general solution for events handling https://rxjs-dev.firebaseapp.com/api.
- 🚞 **GeoJSON Support**, http://geojson.org/.
- 🎨 **Charts**, visualization tools.
- (Optional) Add routing solution like React Router https://github.com/ReactTraining/react-router if it is needed

## 🤝 Contributing [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

We welcome all contributions. 

## 🌍 License

[MIT](https://github.com/umijs/umi/blob/master/LICENSE)