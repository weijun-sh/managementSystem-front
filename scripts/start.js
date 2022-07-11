'use strict';
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

process.on('unhandledRejection', err => {
  throw err;
});

require('../config/env');

const fs = require('fs');
const chalk = require('react-dev-utils/chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const {
  createCompiler,
  prepareProxy,
  prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils');
const paths = require('../config/paths');
const configFactory = require('../config/webpack.config');
const createDevServerConfig = require('../config/webpackDevServer.config');

const useYarn = fs.existsSync(paths.yarnLockFile);

if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

const DEFAULT_PORT =  8000;
const HOST = process.env.HOST || '0.0.0.0';

const config = configFactory('development');
const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const appName = require(paths.appPackageJson).name;

const useTypeScript = fs.existsSync(paths.appTsConfig);
const urls = prepareUrls(
    protocol,
    HOST,
    DEFAULT_PORT,
    paths.publicUrlOrPath.slice(0, -1)
);
const compiler = createCompiler({
  appName,
  config,
  urls,
  useYarn,
  useTypeScript,
  webpack,
});
const proxySetting = require(paths.appPackageJson).proxy;
const proxyConfig = prepareProxy(
    proxySetting,
    paths.appPublic,
    paths.publicUrlOrPath
);
const serverConfig = {
  ...createDevServerConfig(proxyConfig, urls.lanUrlForConfig),
  host: HOST,
  port: DEFAULT_PORT,
};
const devServer = new WebpackDevServer(serverConfig, compiler);

devServer.startCallback();
