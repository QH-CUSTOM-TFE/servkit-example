const baseConfig = require('./base');
const webpack = require('webpack');

const config = {
    ...baseConfig.configer('production')
};

config.devtool = 'cheap-module-source-map';

module.exports = config;