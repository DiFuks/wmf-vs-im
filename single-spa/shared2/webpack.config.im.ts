import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import { Configuration } from 'webpack';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import 'webpack-dev-server';

const config: Configuration = {
  mode: 'development',
  entry: './src/singleSpa.tsx',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [new TsconfigPathsPlugin()],
  },
  output: {
    clean: true,
    libraryTarget: 'module',
    filename: 'shared.js',
  },
  experiments: {
    outputModule: true,
  },
  target: 'web',
  plugins: [new ReactRefreshWebpackPlugin()],
  module: {
    rules: [
      {
        test: /\.tsx?/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  devServer: {
    port: 9_002,
    hot: true,
    host: 'localhost',
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:9000',
    },
  },
};

export default config;
