const path = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const MinifyPlugin = require("babel-minify-webpack-plugin");

let i = 0
module.exports = (webpackPaths) => {
    return {

        mode: 'production',

        entry: [webpackPaths.entry],
        output: {
            path: webpackPaths.output,
            filename: '[id].js'
        },

        resolve: {
            alias: {
                '@': path.join(webpackPaths.mainDir, 'app/client/src/'),
                'libs': path.join(webpackPaths.mainDir, 'app/client/libs')
            }
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

                        // name: (module) => {
                        //     i++
                        //     return i
                        // },
                        
                        name: (module) => {
                            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                            return packageName
                        },
                    },
                },
            },
        },

        plugins: [
            new MinifyPlugin({}, {
                comments: false,
            }),

            new MiniCssExtractPlugin({
                filename: '[name].css',
                chunkFilename: '[id].css',
            }),

            new OptimizeCSSAssetsPlugin()
        ],
        module: {
            rules: [],
        }
    }

}