const webpack = require('webpack');
const dotenv = require('dotenv');

module.exports = function override(config) {
  config.resolve.fallback = {
    path: require.resolve('path-browserify'),
    os: require.resolve('os-browserify/browser'),
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    vm: require.resolve('vm-browserify'),
  };
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ]);
  const env = dotenv.config().parsed;
  // reduce it to a nice object, the same as before
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});
  config.plugins = config.plugins.concat([
    new webpack.DefinePlugin(envKeys)])
  return config;
};
