const process = require('process')
const { rmdirSync, mkdirSync } = require('fs')
const { resolve } = require('path')

const { NODE_ENV, USE_RELOADING } = process.env
const isProduction = NODE_ENV === 'production'
const useReloading = USE_RELOADING === 'on'

const outputDir = resolve('app')
const appConfig = require('./webpack/app')
const mainConfig = require('./webpack/main')

console.log('isProduction: ', isProduction)

module.exports = [appConfig(isProduction, outputDir, useReloading), mainConfig(isProduction, outputDir, useReloading)]