const { resolve } = require('path')
const { exec } = require('child_process')

const workspace = resolve(__dirname, '..')
const source = resolve(workspace, 'src/main/index.ts')
const tkill = require('tree-kill')
const { DefinePlugin } = require('webpack')

let mainProcess

const config = (isProduction, outputDir, useReloading) => ({
  target: 'electron-main',
  context: workspace,
  node: {
    __dirname: false,
  },
  mode: isProduction ? 'production' : 'development',
  watch: !isProduction,
  devtool: isProduction ? undefined : 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
        exclude: /node_modules/,
      },

    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  entry: {
    index: source,
  },
  output: {
    filename: '[name].js',
    path: outputDir,
  },
  plugins: [
    new DefinePlugin({
      ISDEV: JSON.stringify(!isProduction)
    }),
    {
      apply: (compiler) => {
        if (!isProduction && useReloading) {
          compiler.hooks.afterEmit.tap('Run electron main process', () => {
            if (mainProcess) {
              console.log('正在关闭 electron 进程')
              tkill(mainProcess.pid, (err) => {
                if (err) {
                  console.error(`关闭失败\n${err}`)
                } else {
                  console.log('已关闭')
                  console.log('正在启动 electron 进程')
                  mainProcess = exec('npx electron app')
                }
              })
            } else {
              console.log('正在启动 electron 进程')
              mainProcess = exec('npx electron app')
            }
          })
        }
      },
    }
  ],
})

module.exports = config
