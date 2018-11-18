const path = require('path');
const baseConfig = require('./webpack.base');

const cwd = process.cwd();

// Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = baseConfig({
  mode: 'development',
  output: {
    filename: 'app.js'
  },
  module: {
    rules: [
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
    symlinks: false
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(cwd, 'src', 'index.html')
    })
  ],
  devServer: {
    port: process.env.PORT
  }
});
