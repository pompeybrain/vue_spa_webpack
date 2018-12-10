const webpack = require('webpack');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: './dist',
    open: true,
    host: '0.0.0.0',
    public: 'localhost:3700',
    port: 3700,
    stats: 'errors-only'
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: [
        'vue-style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1
          }
        },
        'postcss-loader'
      ]
    }]
  },
  plugins: [new webpack.HotModuleReplacementPlugin({})]
});