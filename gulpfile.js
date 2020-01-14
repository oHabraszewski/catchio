/* import:start */

const fs = require('fs')
const path = require('path')
const spawn = require('child_process').spawn

const gulp = require('gulp')

const webpackStream = require('webpack-stream');

const browserSync = require('browser-sync');

const imagemin = require('gulp-imagemin');
const prettyData = require('gulp-pretty-data');
const minify = require('gulp-minify');

const del = require('del')
// executed 
require('./config/util/gulp/clean.js')(__dirname) // define "util:clean:dev" && "util:clean:prod"

// to execute
const webpackRunner = require('./config/webpack/runner.js')

const { makeStripBlocks, gulpDeleteStripBlocks } = require('./config/util/gulp/stripBlocks.js')

const gulpNext = require('./config/util/gulp/nextGulp.js')

const goodNames = require('./config/util/gulp/goodNames.js')

const browserSyncClientHtml = require('./config/util/gulp/browserSyncClientHtml.js')

const gulpPromise = require('./config/util/gulp/promisifyGulp.js')
/* import:end */
 


 
// for other templates:
let afterWebpackEmit = []
let afterSetEnv = []
let afterMainFolderMakup = [] // dist or dev folder



let userAddons = []
let excludeRules = []
// end




let env = {
    port: 8000,
    config: 'normal',

    mode: null,
    watch: null,
    stripBlocks: null,
    packge: false,

    browser: true,
    command: null
}

// ------------------------------------------------------------------------

let browserSyncProcess = {
    reload: () => { }
}

let serverProcess = null
let serverGood = false
let serverError = null


// ------------------------------------------------------------------------

function restartServerProcess() {
    let firstStartupDone = false

    if (serverProcess != null) {
        serverProcess.removeAllListeners()
        serverProcess.kill("SIGQUIT")
    }

    try {
        serverProcess = spawn(`PORT=${env.port} node ${path.join(__dirname, `${env.mode == 'prod' ? 'dist' : 'dev'}/server/index.js`)}`, { shell: true })
    } catch (e) {
        serverGood = false
        serverError = e
        console.log(`[server error]\n\n${e.toString()}\n\n[server error]`)
        browserSyncProcess.reload()
    }


    serverProcess.stdout.on('data', (data) => {
        serverGood = true
        console.log(`[server] ${data.toString()}`)

        if (!firstStartupDone && data.toString().includes(env.port)) {
            browserSyncProcess.reload()
            firstStartupDone = true
        }
    })

    serverProcess.stderr.on('data', (data) => {
        serverGood = false
        serverError = data
        console.log(`[server error]\n\n${data.toString()}\n\n[server error]`)
        browserSyncProcess.reload()
    })
}

// ------------------------------------------------------------------------

let afterStartCout = 0 // when webpack, assets and server finisches first "round" then fire server
function afterStart() {
    afterStartCout++
    if (afterStartCout == 3 && env.watch) { // run browserSync + nodemon == run server
        if (env.browser)
            gulp.series('methods:browser:startup', 'methods:server:startup')()
        else
            gulp.series('methods:server:startup')()
    }
}


// ------------------------------------------------------------------------
// ------------------------------------------------------------------------
// ------------------------------------------------------------------------

gulp.task('methods:server:startup', function server_run(done) {
    restartServerProcess()
    done()
})


let firstReq = false
gulp.task('methods:browser:startup', (done) => {
    browserSyncProcess = browserSync.init({
        proxy: `http://localhost:${env.port}`,
        files: false,
        watch: false,
        port: 8080,
        middleware: [

            (req, res, next) => {
                if (!firstReq) {
                    res.write(browserSyncClientHtml('Loading...', 'Loading...'))
                    res.end()
                    firstReq = true
                    browserSyncProcess.reload()
                } else next()
            },
            (req, res, next) => {
                if (serverGood == false && serverError != null) {
                    res.write(browserSyncClientHtml(serverError.toString(), 'Server error'))
                    res.end()
                } else next()
            }
        ]
    }, () => {
        done()
    })
})


// ------------------------------------------------------------------------

let webpackDoneAfterStart = false
let gulpAfterWebpackEmit = null
gulp.task('methods:webpack:run', function webpack_run(done) {

    let webpackPaths = {
        entry: path.join(__dirname, 'app/client/index.js'),
        output: path.join(__dirname, env.mode == 'prod' ? 'dist' : 'dev', 'client/'), // translate prod => dist
        htmlIndex: path.join(__dirname, 'app/client/index.html'),
        mainDir: __dirname
    }

    userAddons.push({ entry: [path.join(webpackPaths.mainDir, 'config/polyfill.js')] })

    gulp.src(path.join(__dirname, 'app/**'))
        .pipe(webpackStream(webpackRunner({
            type: env.mode,
            watch: env.watch,
            stripBlocks: env.stripBlocks,
            webpackPaths: webpackPaths,

            excludeRules: excludeRules,
            userAddons: userAddons
        })))
        .pipe(gulp.dest(webpackPaths.output))
        .on('data', async (file) => {
            if (path.basename(file.path) == 'index.html') {
                if (!webpackDoneAfterStart) {

                    if (afterWebpackEmit.length > 0) {
                        gulpAfterWebpackEmit = gulp.series.apply({}, afterWebpackEmit)
                        await gulpPromise(gulpAfterWebpackEmit)
                    }

                    afterStart()
                    done()
                    webpackDoneAfterStart = true
                } else {
                    if (gulpAfterWebpackEmit) await gulpPromise(gulpAfterWebpackEmit)
                    browserSyncProcess.reload()
                }
            }
        })
})

// ------------------------------------------------------------------------

let serverMakeAfterStart = false
gulp.task('methods:server:make',
    gulp.series(
        function server_clean() {
            return del([
                path.join(__dirname, env.mode == 'prod' ? 'dist' : 'dev', 'server/**')
            ])
        },
        function server_make() {
            const hash = 'JIO8dqwiuhU'
            return gulp.src(path.join(__dirname, 'app/server/**'))
                .pipe(gulpDeleteStripBlocks(env.stripBlocks))
                .pipe(env.mode == 'prod' ? minify({ ext: { min: `${hash}.js` } }) : gulpNext())
                .pipe(env.mode == 'prod' ? goodNames(hash) : gulpNext())
                .pipe(gulp.dest(path.join(__dirname, env.mode == 'prod' ? 'dist' : 'dev', 'server/')))
        },
        function run_afterStart(done) {
            done()
            if (!serverMakeAfterStart) {
                serverMakeAfterStart = true
                afterStart()
            } else {
                restartServerProcess()
            }
        }
    )
)

gulp.task('methods:server:run', function server_run(done) {
    if (env.watch == true) {
        gulp.series('methods:server:make')(done)
        gulp.watch(path.join(__dirname, 'app/server/**'), gulp.series('methods:server:make'))
    }
    else if (env.watch == false) {
        gulp.series('methods:server:make')(done)
    } else done("Can't run directly...")
})

// ------------------------------------------------------------------------

let assetsMakeAfterStart = false
gulp.task('methods:assets:make',
    gulp.series(
        function assets_clean() {
            return del([
                path.join(__dirname, env.mode == 'prod' ? 'dist' : 'dev', 'assets/**')
            ])
        },
        function assets_make() {
            return gulp.src(path.join(__dirname, 'app/assets/**'))
                .pipe(prettyData({ type: 'minify' }))
                .pipe(imagemin())
                .pipe(gulp.dest(path.join(__dirname, env.mode == 'prod' ? 'dist' : 'dev', 'assets/'))) // translate prod => dits
        },
        function run_afterStart(done) {
            done()
            if (!assetsMakeAfterStart) {
                assetsMakeAfterStart = true
                afterStart()
            } else {
                browserSyncProcess.reload()
            }
        }
    )
)

gulp.task('methods:assets:run', function assets_run(done) {
    if (env.watch == true) {
        gulp.series('methods:assets:make')(done)
        gulp.watch(path.join(__dirname, 'app/assets/**'), gulp.series('methods:assets:make'))
    }
    else if (env.watch == false) {
        gulp.series('methods:assets:make')(done)
    } else done("Can't run directly...")
})

// ------------------------------------------------------------------------

gulp.task('methods:run',
    gulp.series(
        function methods_run(gDone) {
            gulp.series(
                `util:clean:${env.mode == 'prod' ? 'dist' : 'dev'}`,

                function make_mode(done) {
                    if (!fs.existsSync((path.join(__dirname, env.mode == 'prod' ? 'dist' : 'dev') + '/')))
                        fs.mkdirSync(path.join(__dirname, env.mode == 'prod' ? 'dist' : 'dev') + '/')
                    done()
                },
                function make_pakage(done) {
                    if (env.packge) {
                        const package = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json')).toString())
                        let newPackage = {}
                        for (const key in package) {
                            if (key != 'devDependencies' && key != 'browserslist') {
                                newPackage[key] = package[key]
                            }
                        }
                        fs.writeFileSync(path.join(__dirname, env.mode == 'prod' ? 'dist' : 'dev', 'package.json'), JSON.stringify(newPackage))
                    }
                    done()
                },
                function after_main_folder_makup(done) {
                    if (afterMainFolderMakup.length > 0)
                        gulp.series.apply({}, afterMainFolderMakup)(done)
                    else done()
                },
                gulp.parallel(
                    'methods:webpack:run',
                    'methods:assets:run',
                    'methods:server:run'
                ),
                function call_done(done) {
                    done()
                    gDone()
                }
            )()
        }
    )
)

// ------------------------------------------------------------------------
// ------------------------------------------------------------------------
// ------------------------------------------------------------------------


function run_after_normal() {
    if (afterSetEnv.length > 0)
        gulp.series.apply({}, afterSetEnv)()
}


// ------------------------------------------------------------------------ DEV

function setDefaultEnvWebDev(stripBlocks) {
    env.mode = 'dev'
    stripBlocks.push({ base: 'dev' })
    env.stripBlocks = makeStripBlocks(stripBlocks)
    env.watch = true
}

// ------------------------------------------------------------------------ WEB

gulp.task('dev:web',
    gulp.series(
        function set_env(done) {
            setDefaultEnvWebDev([])
            run_after_normal(),

                done()
        },
        'methods:run'
    )
) // webpack watch dev for web
gulp.task('default', gulp.series('dev:web'))


gulp.task('dev:web:no',
    gulp.series(
        function set_env(done) {
            setDefaultEnvWebDev([])
            env.watch = false
            run_after_normal()
            done()
        },
        'methods:run'
    )
) // webpack (no watch) dev for web

// ------------------------------------------------------------------------ BUILD

function setDefaultEnvWebProd(stripBlocks) {
    process.env.NODE_ENV = 'production'
    env.mode = 'prod'
    stripBlocks.push({ base: 'prod' })
    env.stripBlocks = makeStripBlocks(stripBlocks)
    env.watch = false
    env.packge = true
}

gulp.task('prod:web',
    gulp.series(
        function set_env(done) {
            setDefaultEnvWebProd([])
            run_after_normal()

            done()
        },
        'methods:run'
    )
)  // webpack (no watch)  prod for web


gulp.task('prod:server',
    gulp.series(
        function set_env(done) {
            setDefaultEnvWebProd([{ base: 'server' }])
            run_after_normal()

            done()
        },
        'methods:run'
    )
) // webpack build FOR server (mostly only make sense in case of stripBlocks)

