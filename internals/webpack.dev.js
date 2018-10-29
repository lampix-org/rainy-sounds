const path = require('path');
const baseConfig = require('./webpack.base');

const cwd = process.cwd();

// Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = baseConfig({
  output: {
    filename: 'app.js'
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader'
          }
        ]
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
  ]
});
