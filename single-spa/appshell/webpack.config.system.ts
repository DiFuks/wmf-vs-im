import HtmlWebpackPlugin from 'html-webpack-plugin';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import { Configuration, EnvironmentPlugin } from 'webpack';
import 'webpack-dev-server';

const config: Configuration = {
  mode: 'development',
  entry: './src/index.ts',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    plugins: [new TsconfigPathsPlugin()],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: 'body',
      templateContent: `
        <html lang="en">
          <body></body>
        </html>
      `,
    }),
    new EnvironmentPlugin({
      TARGET: 'system',
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
