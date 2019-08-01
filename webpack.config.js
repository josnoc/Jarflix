const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

module.exports = {
  entry: "./src/app.tsx",
  mode: "development",
  devtool: "cheap-module-source-map", //"inline-source-map"
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "public", "dist")
  },
  optimization: {
    minimizer: [new UglifyJsPlugin({}), new OptimizeCSSAssetsPlugin({})]
  },
  watchOptions: {
    ignored: /node_modules/
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      },
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(jpg|png|gif|webp|svg)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "images/[name].[hash].[ext]",
            publicPath: "/dist",
            useRelativePath: false
          }
        }
      },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(["dist"]),
    new CompressionPlugin({
      filename: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$/,
      threshold: 244,
      deleteOriginalAssets: true,
      minRatio: 0.8
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
};
