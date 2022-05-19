import HtmlWebpackPlugin from 'html-webpack-plugin';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import { Configuration, EnvironmentPlugin, container } from 'webpack';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import ExternalTemplateRemotesPlugin from 'external-remotes-plugin';
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
    new EnvironmentPlugin({
      APP_ID: appId,
      TARGET: 'wmf',
    }),
    new ReactRefreshWebpackPlugin(),
    new ModuleFederationPlugin({
      name: 'wmf',
      remotes: {
        sharedApp: 'shared@[sharedAppUrl]/shared.js',
      },
      shared: {
        react: { singleton: true, requiredVersion: dependencies.react },
        'react-dom': {
          singleton: true,
          requiredVersion: dependencies['react-dom'],
        },
      },
    }),
    new ExternalTemplateRemotesPlugin(),
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
    port: 9_000,
    hot: true,
  },
};

export default config;
