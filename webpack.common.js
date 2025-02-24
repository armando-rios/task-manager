import path from "path"
import HtmlWebpackPlugin from "html-webpack-plugin"

export default {
  entry: "./src/index.js",
  output: {
    path: path.resolve(process.cwd(), "dist"),
    clean: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html"
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
        use: ["style-loader", "css-loader", "postcss-loader"]
      },
      {
        test: /\.(png|svg|jpg|jpeg|git)$/i,
        type: "asset/resource"
      }
    ]
  }
}
