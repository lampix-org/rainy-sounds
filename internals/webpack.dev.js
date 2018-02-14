const path = require('path');
const baseConfig = require('./webpack.base');
require('dotenv').config();

const cwd = process.cwd();

// Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = baseConfig({
  output: {
    filename: '[name].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            query: !process.env.CSS_MODULES_DISABLED ? {
              modules: true,
              localIdentName: '[name]__[local]__[hash:base64:5]',
              camelCase: true
            } : null
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
