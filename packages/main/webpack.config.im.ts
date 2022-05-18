import HtmlWebpackPlugin from 'html-webpack-plugin';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import { Configuration, EnvironmentPlugin } from 'webpack';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import 'webpack-dev-server';

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
      inject: 'body',
      templateContent: `
        <html lang="en">
          <script type="importmap">
            {
              "imports": {
                "sharedApp/App": "http://localhost:9001/shared.js"
              }
            }
          </script>
          <body>
            <div id="${appId}"></div>
          </body>
        </html>
      `,
    }),
    new EnvironmentPlugin({
      APP_ID: appId,
      TARGET: 'im',
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
    port: 9_000,
    hot: true,
  },
};

export default config;
