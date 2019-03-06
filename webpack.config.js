const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const WebpackBundleAnalyzer = require('webpack-bundle-analyzer');

/*
const {
  BundleAnalyzerPlugin,
} = WebpackBundleAnalyzer;
*/

module.exports = {
  // 入口文件
  entry: {
    app: './src/index.tsx',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_module/,
      },
      {
        test: /\.(ts|tsx)$/,
        use: [{
          loader: 'babel-loader',
        }, {
          loader: 'ts-loader',
        }],
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        use: [{
          loader: require.resolve('style-loader'),
        }, {
          loader: require.resolve('css-loader'), // translates CSS into CommonJS
        }, {
          loader: require.resolve('less-loader'), // compiles Less to CSS
          options: {
            sourceMap: true,
            modifyVars: {
              'primary-color': '#005CAF', // RURI
              'link-color': '#005CAF', // RURI
              // 'link-color': '#0c4842', // ONANDO
            },
            javascriptEnabled: true,
          },
        }],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options:
              {
                name: 'img/[name]_[hash:7].[ext]',
              },
          }],
      },
    ],
  },
  resolve: {
    alias: {
      assets: path.resolve(__dirname, './src/assets'),
      config: path.resolve(__dirname, './config'),
      components: path.resolve(__dirname, './src/components'),
      gm: path.resolve(__dirname, './src/components/google'),
      mapbox: path.resolve(__dirname, 'src/components/mapbox'),
      maplayout: path.resolve(__dirname, './src/components/layout/map-layout'),
      osm: path.resolve(__dirname, './src/components/osm'),
      reducers: path.resolve(__dirname, './src/components/utils/reducers'),
      src: path.resolve(__dirname, './src'),
      typings: path.resolve(__dirname, './typings'),
      utils: path.resolve(__dirname, './src/components/utils'),
    },
    extensions: ['*', '.js', 'jsx', '.tsx', '.ts'],
  },
  // 输出到lib文件夹, 文件名字为bundle.js
  output: {
    filename: 'easy-react-google-maps.js',
    library: 'easy-react-google-maps',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, './lib'),
  },
  devServer: {
    contentBase: './dist',
    hot: true,
    // progress: true,
    historyApiFallback: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'Easy React Google Maps',
      template: 'src/assets/index.html',
      favicon: 'public/favicon.png',
    }),
    // new BundleAnalyzerPlugin(),
  ],
};
