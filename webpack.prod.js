import common from "./webpack.common.js"
import MiniCssExtractPlugin from "mini-css-extract-plugin"

export default {
  ...common,
  mode: "production",
  output: {
    ...common.output,
    filename: "main.[contenthash].js"
  },
  plugins: [
    ...common.plugins,
    new MiniCssExtractPlugin({
      filename: "styles.[contenthash].css"
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "swc-loader"
        }
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"]
      },
      {
        test: /\.(png|svg|jpg|jpeg|git)$/i,
        type: "asset/resource"
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      "..."
    ]
  }
}
