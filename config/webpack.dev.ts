import webpack from 'webpack';
import merge from 'webpack-merge';
import commonConfig from './webpack.common';

module.exports = merge(commonConfig, {
  mode: 'development',
  devtool: '#@cheap-module-source-map',
  devServer: {
    contentBase: './dist',
    open: true,
    host: '0.0.0.0',
    public: 'localhost:3700',
    port: 3700,
    stats: 'errors-only'
  },
  plugins: [new webpack.HotModuleReplacementPlugin({})]
});
