const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/*
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer');
const {
  BundleAnalyzerPlugin,
} = WebpackBundleAnalyzer; */

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
              'primary-color': '#0c4842', //  ONANDO
              'link-color': '#0c4842', //  ONANDO
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
    ],
  },
  resolve: {
    alias: {
      components: path.resolve(__dirname, './src/components'),
      config: path.resolve(__dirname, './config'),
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
    }),
    // new BundleAnalyzerPlugin()
  ],
};
