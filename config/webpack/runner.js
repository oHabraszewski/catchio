const fs = require('fs')
const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = (rawProps = {
    type: '',
    watch: true,
    stripBlocks: [],
    userAddons: [],
    excludeRules: [],
    webpackPaths: {
        entry: '',
        output: '',
        htmlIndex: ''
    },
}) => {

    let type = rawProps.type || 'dev'
    let webpackPaths = rawProps.webpackPaths || {}
    let watch = rawProps.watch != undefined ? rawProps.watch : true
    let stripBlocks = rawProps.stripBlocks || []

    let userAddons = rawProps.userAddons || []
    let excludeRules = rawProps.excludeRules || []


    let config
    if (webpackPaths.entry != undefined && webpackPaths.output != undefined && webpackPaths.htmlIndex != undefined && webpackPaths.mainDir != undefined) {
        config = require(`./webpack.${type}.js`)(webpackPaths)
    } else {
        console.error('need webpackPaths')
        process.exit(1)
    }


    const rules = require('./rules.js') || []

    const develblock = {
        test: /\.s[ac]ss$|\.css$|\.js$|\.html$|\.vue$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: []
    }

    for (const stripBlock of stripBlocks) {
        develblock.use.push({
            loader: path.join(__dirname, '../util/webpack/webpackStripBlock.js'),
            options: {
                start: `${stripBlock.base}:${stripBlock.key || 'start'}`,
                end: `${stripBlock.base}:end`
            }
        })
    }

    if (stripBlocks.length > 0) config.module.rules.push(develblock)

    for (const i in rules) {
        let exclude = false
        for (const name of excludeRules) if (i == name) exclude = true

        if (!exclude)
            config.module.rules.push(rules[i])
    }

    if (fs.existsSync(path.join(__dirname, 'addons/'))) {
        const dir = fs.readdirSync(path.join(__dirname, 'addons/'))
        for (const thing of dir) {
            if (thing.includes(type)) {
                try {
                    const req = require(path.join(__dirname, 'addons', thing))(webpackPaths)
                    if (req != undefined && typeof req == 'object') {
                        defineProperitesForObjectRecursively(config, req)
                    }

                } catch (e) { }
            }
        }
    }

    if (watch != undefined) {
        defineProperitesForObjectRecursively(config, {
            watch: watch
        })
    }


    for (const addon of userAddons) defineProperitesForObjectRecursively(config, addon)

    // add the html webpack plugin last, so webpack emits it last
    config.plugins.push(
        type == 'dev'
            ? new HtmlWebpackPlugin({ template: webpackPaths.htmlIndex })
            : new HtmlWebpackPlugin({
                template: webpackPaths.htmlIndex,
                minify: {
                    minifyCSS: true,
                    collapseWhitespace: true,
                    removeComments: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    useShortDoctype: true
                },
            }),
    )

    return config

}


function defineProperitesForObjectRecursively(rawBase, otherObj) {
    const runner = (base, otherThing) => {
        if (typeof base == 'object' && typeof otherThing == 'object' && !Array.isArray(base) && !Array.isArray(otherThing)) {
            for (const i in otherThing) {

                if (typeof otherThing[i] == 'object' || Array.isArray(otherThing[i]) && base.hasOwnProperty(i)) runner(base[i], otherThing[i])
                else base[i] = otherThing[i]

            }
        } else if (Array.isArray(base) && Array.isArray(otherThing)) {
            for (const elem of otherThing) base.push(elem)
        }
    }

    runner(rawBase, otherObj)
}