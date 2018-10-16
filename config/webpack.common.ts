import path from 'path';
import webpack from 'webpack';
// tslint:disable-next-line:no-var-requires
const HtmlWebpackPlugin = require('html-webpack-plugin');

// tslint:disable-next-line:no-var-requires
const CleanWebpackPlugin = require('clean-webpack-plugin');

// tslint:disable-next-line:no-var-requires
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const config: webpack.Configuration = {
  entry: {
    app: './src/main.ts'
  },
  output: {
    filename: '[name]_[hash].js',
    path: path.resolve(__dirname, '../dist')
  },
  resolve: {
    extensions: ['.ts', '.vue', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          happyPackMode: true,
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader']
      },
      {
        test: /\.styl$/,
        use: ['style-loader', 'css-loader', 'stylus-loader']
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname, '../'),
      verbose: false
    }),
    new HtmlWebpackPlugin({
      title: 'index',
      template: './src/index.html'
    })
  ]
};
export default config;
