const webpack = require('webpack');
// Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const { optionalFilesCopyRules } = require('./optionalFilesCopyRules');
const { joinToCwd } = require('./joinToUtils');

const optionalFileRules = optionalFilesCopyRules([
  'config.json'
], {
  root: joinToCwd(),
  outputPath: ''
});

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
      template: joinToCwd('src', 'index.html')
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development'
    }),
    new CopyPlugin([
      { from: joinToCwd('package.json'), to: '' }
    ].concat(optionalFileRules))
  ],
  devServer: {
    port: process.env.PORT
  }
});
