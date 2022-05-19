import HtmlWebpackPlugin from 'html-webpack-plugin';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import { Configuration, EnvironmentPlugin, container } from 'webpack';
import ExternalTemplateRemotesPlugin from 'external-remotes-plugin';
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
          <body>
             <template id="single-spa-layout">
                <single-spa-router>
                    <route path="/" exact>
                      <application name="sharedApp/App"></application>
                    </route>
                    <route path="/shared2">
                      <application name="sharedApp2/App"></application>
                    </route>
                </single-spa-router>
              </template>
          </body>
        </html>
      `,
    }),
    new EnvironmentPlugin({
      TARGET: 'wmf',
    }),
    new ModuleFederationPlugin({
      name: 'wmf',
      remotes: {
        sharedApp: 'shared1@[sharedAppUrl]/shared.js',
        sharedApp2: 'shared2@[sharedApp2Url]/shared.js',
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
    historyApiFallback: true,
  },
};

export default config;
