import HtmlWebpackPlugin from 'html-webpack-plugin';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import { Configuration, EnvironmentPlugin, container } from 'webpack';
import 'webpack-dev-server';

const { ModuleFederationPlugin } = container;

const config: Configuration = {
  mode: 'development',
  entry: './src/index.wmf.ts',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [new TsconfigPathsPlugin()],
  },
  plugins: [
    new HtmlWebpackPlugin({
      templateContent: `
        <html lang="en">
          <body></body>
        </html>
      `,
    }),
    new EnvironmentPlugin({
      TARGET: 'wmf',
    }),
    new ModuleFederationPlugin({
      name: 'wmf',
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
    port: 9_000,
    hot: true,
    historyApiFallback: true,
  },
};

export default config;
