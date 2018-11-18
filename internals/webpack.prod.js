const webpack = require('webpack');
const path = require('path');

const cwd = process.cwd();

// Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = () => ({
  mode: 'production',
  output: {
    filename: '[name].js',
    path: path.join(cwd, 'dist')
  },
  entry: {
    app: path.join(cwd, 'src', 'index.js')
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
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          { loader: 'file-loader?name=[name].[ext]' },
          {
            loader: 'image-webpack-loader',
            options: {
              pngquant: {
                quality: '65-90',
                speed: 4
              },
              optipng: {
                optimizationLevel: 7
              },
              mozjpeg: {
                progressive: true
              },
              gifsicle: {
                interlaced: false
              }
            }
          }
        ]
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
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css',
    }),
    // Extract app code to own file
    new HtmlWebpackPlugin({
      template: path.join(cwd, 'src', 'index.html')
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production'
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2,
          maxInitialRequests: 5, // The default limit is too small to showcase the effect
          minSize: 0 // This is example is too small to create commons chunks
        },
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          priority: 10,
          enforce: true
        }
      }
    }
  }
});
