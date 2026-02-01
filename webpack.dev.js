import common from './webpack.common.js';

export default {
  ...common,
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    watchFiles: ['./index.html'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|git)$/i,
        type: 'asset/resource',
      },
    ],
  },
};
