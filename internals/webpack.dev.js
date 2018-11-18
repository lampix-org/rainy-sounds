const webpack = require('webpack');
const path = require('path');

const cwd = process.cwd();

// Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = () => ({
  mode: 'development',
  output: {
    filename: 'app.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader?name=[name].[ext]'
      },
      {
        test: /\.(mp4|webm|ogv)$/,
        loader: 'file-loader?name=[name].[ext]'
      },
      {
        test: /\.s?css$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'file-loader?name=[name].[ext]'
      }
    ]
  },
  resolve: {
    symlinks: false,
    modules: [
      'src',
      'node_modules'
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(cwd, 'src', 'index.html')
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development'
    })
  ],
  devServer: {
    port: process.env.PORT
  }
});
