import common from "./webpack.common.js"

export default {
  ...common,
  mode: "development",
  devtool: "eval-source-map",
  devServer: {
    watchFiles: ["./index.html"]
  }
}
