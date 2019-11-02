const path = require('path')

const {
    SourceMapDevToolPlugin
} = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = (keys = []) => {

    const config = {
        watch: true,
        devtool: false,
        mode: 'development',
        entry: ['babel-polyfill', path.resolve(__dirname, '../../app/client/app.js')],
        output: {
            path: path.resolve(__dirname, '../../dev/client'),
            filename: 'app.js'
        },
        optimization: {
            runtimeChunk: 'single',
            splitChunks: {
                chunks: 'all',
                maxInitialRequests: Infinity,
                minSize: 0,
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
                        name: (module) => {
                            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                            return `npm.${packageName.replace('@', '')}`;
                        },
                    },
                },
            },
        },
        plugins: [
            new CleanWebpackPlugin.CleanWebpackPlugin(),
            new SourceMapDevToolPlugin(),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, '../../app/client/index.html')
            }),
            new MiniCssExtractPlugin({
                filename: '[name].css',
                chunkFilename: '[id].css',
                sourceMap: true
            }),
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    map: {
                        inline: true
                    }
                }
            })
        ],
        module: {
            rules: [{
                test: /\.m?js$/i,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-proposal-object-rest-spread']
                    }
                }
            },
            {
                test: /\.s[ac]ss|\.css$/i,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: (resourcePath, context) => path.relative(path.dirname(resourcePath), context) + '/',
                    },
                },
                    "css-loader",
                {
                    loader: 'postcss-loader',
                    options: {
                        plugins: [
                            require('postcss-import'),
                            require('autoprefixer')
                        ],
                    }
                },
                    "sass-loader",

                ],
            }
            ],
        }
    }

    const develblock = {
        test: /\.js$/,
        enforce: 'pre',
        exclude: /(node_modules|bower_components|\.spec\.js)/,
        use: []
    }

    for (const key of keys) {
        develblock.use.push({
            loader: 'webpack-strip-block',
            options: {
                start: `develblock:${key}`,
                end: 'develblock:end'
            }
        })
    }

    config.module.rules.push(develblock)
    return config
}