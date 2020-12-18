const Koa = require('koa2');
const koaStatic = require('koa-static');
const koaWebpackMiddle = require('koa-webpack-middleware');
const webpack = require('webpack');
const webpackConfig = require('../webpack/development');

const devMiddleware = koaWebpackMiddle.devMiddleware;
const hotMiddleware = koaWebpackMiddle.hotMiddleware;

class Server {
    start() {
        const devServerConfig = webpackConfig.devServer;

        const app = new Koa();
        app.use(koaStatic(process.cwd()));

        const compile = webpack(webpackConfig);
        const options = {
            ...devServerConfig,
        };

        options.headers = {
            'X-Custom-Header': 'yes',
        };

        options.stats = {
            colors: true,
        };

        app.use(devMiddleware(compile, options));
        app.use(hotMiddleware(compile, {}));

        app.listen(devServerConfig.port || 8000);
    }
}

const server = new Server();

server.start();



