import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import { Configuration, container, EnvironmentPlugin } from 'webpack';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import 'webpack-dev-server';
// eslint-disable-next-line no-relative-imports/no-relative-imports
import { dependencies } from './package.json';

const { ModuleFederationPlugin } = container;

const appId = 'app';

const config: Configuration = {
  mode: 'development',
  entry: './src/index.tsx',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [new TsconfigPathsPlugin()],
  },
  output: {
    publicPath: 'auto',
  },
  plugins: [
    new HtmlWebpackPlugin({
      templateContent: `
        <html lang="en">
          <body>
            <div id="${appId}"></div>
          </body>
        </html>
      `,
    }),
    new ReactRefreshWebpackPlugin(),
    new EnvironmentPlugin({
      APP_ID: appId,
    }),
    new ModuleFederationPlugin({
      // Must be unique
      name: 'shared2',
      filename: 'shared.js',
      exposes: {
        './App': './src/singleSpa',
      },
      shared: {
        react: { singleton: true, requiredVersion: dependencies.react },
        'react-dom': {
          singleton: true,
          requiredVersion: dependencies['react-dom'],
        },
      },
    }),
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
    port: 9_002,
    hot: true,
  },
};

export default config;
