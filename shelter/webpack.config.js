const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    entry: {
      main: "./src/pages/main/main.js",
      pets: "./src/pages/pets/pets.js",
    },

    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "js/[name].[contenthash:8].js",
      publicPath: isProduction ? "/shelter/" : "/",
      clean: true,
    },

    devServer: {
      static: {
        directory: path.resolve(__dirname, "dist"),
      },
      port: 8080,
      open: true,
      hot: true,
      historyApiFallback: true,
    },

    module: {
      rules: [
        {
          test: /\.html$/i,
          loader: "html-loader",
        },
        {
          test: /\.css$/i,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
          ],
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
            "sass-loader",
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
          type: "asset/resource",
          generator: {
            filename: "assets/images/[name][ext]",
          },
        },
        {
          test: /\.(woff|woff2)$/i,
          type: "asset/resource",
          generator: {
            filename: "assets/fonts/[name][ext]",
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/pages/main/index.html",
        filename: "index.html",
        chunks: ["main"],
        inject: "body",
      }),
      new HtmlWebpackPlugin({
        template: "./src/pages/pets/pets.html",
        filename: "pets.html",
        chunks: ["pets"],
        inject: "body",
      }),
      new MiniCssExtractPlugin({
        filename: "css/[name].[contenthash:8].css",
      }),
    ],
    devtool: isProduction ? false : "source-map",
  };
};
