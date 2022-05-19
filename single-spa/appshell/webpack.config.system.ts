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
          <script type="systemjs-importmap">
            {
              "imports": {
                "sharedApp/App": "http://localhost:9001/shared.js",
                "sharedApp2/App": "http://localhost:9002/shared.js"
              }
            }
          </script>
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
