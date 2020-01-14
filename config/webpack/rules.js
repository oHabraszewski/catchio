/* import:start */
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
/* import:end */



module.exports = {


    // "babel": {
    //     test: /\.m?js$/i,
    //     exclude: [
    //         /node_modules\/webpack|html-webpack-plugin\//,
    //         /node_modules\/core-js(\/|).*/
    //     ],
    //     use: {
    //         loader: 'babel-loader',
    //         options: {
    //             "presets": [
    //                 [
    //                     "@babel/preset-env",
    //                     {
    //                         "useBuiltIns": "usage",
    //                         "corejs": 3,
    //                     }
    //                 ],
    //             ],
    //             sourceType: 'unambiguous',
    //             "plugins": [
    //                 "object-to-json-parse"
    //             ]
    //         }
    //     }
    // },

    "scss": {
        test: /\.s[ac]ss|\.css$/i,
        use: [
            {
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
                        require('postcss-import')(),
                        require('postcss-preset-env')({
                            stage: 0
                        })
                    ],
                }
            },

            "sass-loader"
        ],
    },

    "html": {
        test: /\.html/,
        loader: 'html-loader',
        exclude: /node_modules/
    }


}