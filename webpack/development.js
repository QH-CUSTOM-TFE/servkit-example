const baseConfig = require('./base');
const webpack = require('webpack');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const path = require('path');

const config = {
    ...baseConfig.configer('development')
};

let publicPath = baseConfig.path.build;
publicPath = publicPath.replace(path.resolve('./'), '');
if (publicPath.endsWith('/')) {
    publicPath = publicPath.substring(0, publicPath.length - 1);
}
publicPath += '-dev/';
if (!publicPath.startsWith('/')) {
    publicPath = '/' + publicPath;
}

config.devServer = {
    publicPath,
    port: 8000,
    watchOptions: {
        aggregateTimeout: 500,
        poll: true,
    },
    stats: 'errors-only',
};
config.devtool = 'cheap-module-eval-source-map';
// config.entry.index.push('webpack-hot-middleware/client?path=/__webpack_hmr&timeout=2000');
config.plugins.push(new webpack.HotModuleReplacementPlugin());
config.plugins.push(new CheckerPlugin());
{
    let indexPath = publicPath += 'index.html';
    const url = `http://localhost:${config.devServer.port}${indexPath}`;
    config.plugins.push(new OpenBrowserPlugin({ url }));
}

module.exports = config;