const { resolve } = require('path')

const workspace = resolve(__dirname, '..')
const public = resolve(workspace, 'src/public')

const entry = resolve(workspace, 'src/index.tsx')

//HTMLWebpackPlugin's options
const HTMLWebpackPlugin = require('html-webpack-plugin')
const htmlTemplate = resolve(public, 'index.html')
const favicon = resolve(public, 'favicon.ico')

const config = (isProduction, outputDir) => ({
  target: 'electron-renderer',
  mode: isProduction ? 'production' : 'development',
  watch: !isProduction,
  devtool: isProduction ? undefined : 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.html?$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: isProduction,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  entry: {
    app: entry,
  },
  output: {
    filename: '[name].js',
    path: resolve(outputDir, 'app'),
    // publicPath: '/'
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: htmlTemplate,
      // favicon: favicon,
      filename: 'index.html',
    }),
  ],
})

module.exports = config
