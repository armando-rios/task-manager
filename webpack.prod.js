import common from "./webpack.common.js"

export default {
  ...common,
  mode: "production",
  output: {
    ...common.output,
    filename: "main.[contenthash].js"
  },
  optimization: {
    minimize: true,
    minimizer: [
      "..."
    ]
  }
}
