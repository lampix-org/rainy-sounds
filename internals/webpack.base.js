const path = require('path');

const cwd = process.cwd();

module.exports = (options) => ({
  mode: options.mode,
  optimization: options.optimization,
  entry: Object.assign({
    app: path.join(cwd, 'src', 'index.js')
  }, options.entry),
  output: Object.assign({}, options.output),
  module: {
    rules: options.module.rules.concat([
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
      }
    ])
  },
  resolve: Object.assign({
    modules: [
      'src',
      'node_modules'
    ]
  }, options.resolve),
  plugins: options.plugins.concat([]),
  devServer: options.devServer
});
