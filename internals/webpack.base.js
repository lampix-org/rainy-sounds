const path = require('path');

const cwd = process.cwd();

module.exports = (options) => ({
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
      }
    ])
  },
  resolve: Object.assign({
    modules: [
      'src',
      'node_modules'
    ]
  }, options.resolve),
  plugins: options.plugins.concat([])
});
