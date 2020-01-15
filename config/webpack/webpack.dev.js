const path = require('path')

const SourceMapDevToolPlugin = require('webpack').SourceMapDevToolPlugin

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

let i = 0
module.exports = (webpackPaths) => {
    return {

        watch: true,
        devtool: false,
        mode: 'development',

        entry: [webpackPaths.entry],
        output: {
            path: webpackPaths.output,
            filename: 'index.js'
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
                        //     const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                        //     i++
                        //     if (packageName[0] == '.')
                        //         return `z${packageName.replace('@', '')}.${i}`;
                        //     else
                        //         return `z.${packageName.replace('@', '')}.${i}`;
                        // },

                        name: (module) => {
                            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                            if (packageName[0] == '.')
                                return `z${packageName.replace('@', '')}`;
                            else
                                return `z.${packageName.replace('@', '')}`;
                        },
                    },
                },
            },
        },

        plugins: [
            new SourceMapDevToolPlugin(),

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
            rules: []
        }
    }

}