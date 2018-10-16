// tslint:disable-next-line:no-var-requires
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// tslint:disable-next-line:no-var-requires
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// tslint:disable-next-line:no-var-requires
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// tslint:disable-next-line:no-var-requires
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

import merge from 'webpack-merge';
import commonConfig from './webpack.common';

module.exports = merge(commonConfig, {
  mode: 'production',
  optimization: {
    runtimeChunk: 'single',
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({}),
      new BundleAnalyzerPlugin()
    ]
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { importLoaders: 1 }
          },
          'postcss-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ],
  stats: {
    children: false,
    entrypoints: false,
    modules: false
  }
});
