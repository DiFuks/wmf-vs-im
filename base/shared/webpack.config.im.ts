import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import { Configuration, EnvironmentPlugin } from 'webpack';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import 'webpack-dev-server';

const appId = 'app';

const config: Configuration = {
  mode: 'development',
  entry: './src/App.tsx',
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
  plugins: [
    new EnvironmentPlugin({
      APP_ID: appId,
    }),
    new ReactRefreshWebpackPlugin(),
  ],
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
    port: 9_001,
    hot: true,
    host: 'localhost',
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:9000',
    },
  },
};

export default config;
