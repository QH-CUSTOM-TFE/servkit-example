const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HappyPackPlugin = require('happypack');
const WebpackNotifier = require('webpack-notifier');
const CaseSensitivePlugin = require('case-sensitive-paths-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin')

const os = require('os');
const path = require('path');


const REG_NODE_MODUELS = /node_modules/;
const PATH_SOURCE = path.resolve('./src/');
const PATH_SOURCE_RESOUCE = path.join(PATH_SOURCE, 'res');
const PATH_SOURCE_RESOUCE_HTML = path.join(PATH_SOURCE_RESOUCE, 'html');
const PATH_BUILD = path.resolve('./build/');
const PATH_ASSETS = path.join(PATH_BUILD, 'assets');
const PATH_RESOUCE = path.join(PATH_BUILD, 'res');
const PATH_RESOUCE_HTML = path.join(PATH_RESOUCE, 'html');
const PATH_RESOUCE_IMG = path.join(PATH_RESOUCE, 'img');

const configBuilder = (env) => {
    const isDevelopment = env === 'development';
    const isProduction = env === 'production';

    const cssLoader = {
        loader: 'css-loader',
        options: {
            sourceMap: true,
        }
    };

    const postCssLoader = {
        loader: 'postcss-loader',
        options: {
            config: {
                path: path.join(__dirname, './postcss.config.js'),
                ctx: {
                    'postcss-preset-env': {
                        stage: 2,
                    },
                    cssnano: isProduction,
                }
            },
        }
    }

    const happyThreadPool = HappyPackPlugin.ThreadPool({ size: os.cpus().length });

    const styleExtracter = new ExtractTextPlugin({
        filename: 'assets/[name].css',
        disable: !isProduction,
    });

    const entry = {
        index: [
            path.join(PATH_SOURCE, 'index.ts'),
        ],
        scene: [
            path.join(PATH_SOURCE, 'scene.ts'),
        ],
        serv0: [
            path.join(PATH_SOURCE, 'serv0.ts'),
        ],
        serv1: [
            path.join(PATH_SOURCE, 'serv1.ts'),
        ]
    };

    const wModule = {
        rules: [
            {
                test: /\.js$/,
                use: 'source-map-loader',
                enforce: 'pre',
            },
            {
                test: /\.jsx?$/,
                use: 'babel-loader',
                exclude: REG_NODE_MODUELS,
                include: PATH_SOURCE,
            },
            {
                test: /\.css$/,
                use: styleExtracter.extract({
                    fallback: 'style-loader',
                    use: [
                        cssLoader,
                        postCssLoader,
                    ]
                }),
            },
            {
                test: /\.styl$/,
                use: styleExtracter.extract({
                    fallback: 'style-loader',
                    use: 'happypack/loader?id=styl',
                }),
            },
            {
                test: /\.scss$/,
                use: styleExtracter.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: "style-loader" // 将 JS 字符串生成为 style 节点
                    }, {
                        loader: "css-loader" // 将 CSS 转化成 CommonJS 模块
                    }, {
                        loader: "sass-loader" // 将 Sass 编译成 CSS
                    }]
                }),
            },
            {
                test: /\.(png|gif|jpg|jpeg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]-[hash:4].[ext]',
                            outputPath: PATH_RESOUCE_IMG,
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                use: 'raw-loader',
            },
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'awesome-typescript-loader',
                        options: {
                            forceIsolateModules: true,
                        }
                    }
                ],
            }
        ]
    };

    const plugins = [
        styleExtracter,
        new HappyPackPlugin({
            id: 'styl',
            // cache: true,
            threadPool: happyThreadPool,
            loaders: [
                cssLoader,
                postCssLoader,
                {
                    loader: 'stylus-loader',
                    options: {}
                }
            ],
            verbose: true,
        }),
        new WebpackNotifier({ alwayseNotify: true }),
        new webpack.ContextReplacementPlugin(
            /^\.\/locale$/,
            (context) => {
                if (!/moment[\/\\]/.test(context.context)) {
                    return;
                }

                Object.assign(context, {
                    regExp: /^en\.js/,
                    request: './'
                });
            }
        ),
        new CaseSensitivePlugin(),
        new HtmlWebpackPlugin({
            title: 'Main',
            filename: 'index.html',
            chunks: ['index', 'manifest'],
            template: path.join(PATH_SOURCE_RESOUCE_HTML, 'indexTemplate.html'),
        }),
        new HtmlWebpackPlugin({
            title: 'Serv0',
            filename: 'serv0.html',
            chunks: ['serv0', 'manifest'],
            template: path.join(PATH_SOURCE_RESOUCE_HTML, 'indexTemplate.html'),
        }),
        new HtmlWebpackPlugin({
            title: 'Serv1',
            filename: 'serv1.html',
            chunks: ['serv1', 'manifest'],
            template: path.join(PATH_SOURCE_RESOUCE_HTML, 'indexTemplate.html'),
        }),
        new HtmlWebpackPlugin({
            title: 'Scene',
            filename: 'scene.html',
            chunks: ['scene'],
            template: path.join(PATH_SOURCE_RESOUCE_HTML, 'indexTemplate.html'),
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            minChunks: Infinity,
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(env),
        }),
        new CopyWebpackPlugin([
            {
                from: PATH_SOURCE_RESOUCE,
                to: PATH_RESOUCE,
            }
        ], 
        {
            debug: isDevelopment,
        }),
    ];

    if (isProduction) {
        plugins.push(new UglifyJSPlugin());
    }

    return {
        entry,
        module: wModule,
        plugins,
        output: {
            filename: 'assets/[name].js',
            path: PATH_BUILD,
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx']
        },
    };
}



module.exports = {
    configer: configBuilder,
    path: {
        root: path.resolve('.'),
        source: PATH_SOURCE,
        build: PATH_BUILD,
        resouce: PATH_RESOUCE,
        assets: PATH_ASSETS,
        html: PATH_RESOUCE_HTML,
        img: PATH_RESOUCE_IMG,
    },
};
