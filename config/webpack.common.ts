import path from "path";
import webpack from "webpack";
var HtmlWebpackPlugin = require("html-webpack-plugin");

var CleanWebpackPlugin = require("clean-webpack-plugin");

var VueLoaderPlugin =  require("vue-loader/lib/plugin")

const config: webpack.Configuration = {
  entry: {
    app: "./src/main.ts"
  },
  output: {
    filename: "[name]_[hash].js",
    path: path.resolve(__dirname, "../dist")
  },
  resolve: {
    extensions: [".ts", ".vue", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        test: /\.styl$/,
        use: ["style-loader", "css-loader", "stylus-loader"]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(["dist"], {
      root: path.resolve(__dirname, "../"),
      verbose: false
    }),
    new HtmlWebpackPlugin({
      title: "index",
      template: "./src/index.html"
    })
  ]
};
export default config;
