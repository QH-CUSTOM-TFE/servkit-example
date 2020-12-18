const baseConfig = require('./development');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = {
    ...baseConfig,
};

config.plugins.push(new BundleAnalyzerPlugin());

module.exports = config;