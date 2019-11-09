// --delelte-heroku-etc.

// heroku == delete on heroku publish
// start == delete on production build 

const path = require('path')
const fs = require('fs')
const spawn = require('child_process').spawn

const gulp = require('gulp')

const webpackStream = require('webpack-stream');
const imagemin = require('gulp-imagemin');
const clean = require('gulp-clean');
const browserSync = require('browser-sync');
const nodemon = require('gulp-nodemon');
const minify = require('gulp-minify');
const prettyData = require('gulp-pretty-data');

const gitConfig = require('./config/gitConfing.js')
const utls = require('./config/gulp/utils.js')

let devs = ['heroku', 'start']

let onPublishDevWeb = false

let webpackClient = false
let webpackServer = false

let webpackClientStream = undefined
let webpackServerStream = undefined

let finishPublishDev = undefined

let afterStartCout = 0

// ------------------------------------------------------------------------
// ------------------------------------------------------------------------
// ------------------------------------------------------------------------


const publishDev = () => {
    webpackClientStream.pause()

    moreArgvString = ''
    for (let arg of process.argv) {
        arg = arg.split('-')
        let found = false
        for (let temp of arg) {
            if (temp == 'delete') {
                found = true
            }
        }
        if (found) {
            moreArgvString = arg
        }
    }

    const otherProcess = spawn(`gulp publishDev --b_u_i_l_d__d_o_n_e ${moreArgvString}`, {
        shell: true
    })

    otherProcess.stderr.pipe(process.stdout)
    otherProcess.stdout.pipe(process.stdout)

    otherProcess.on('close', () => finishPublishDev())
}

const afterStart = () => {
    afterStartCout++
    if (afterStartCout == 2) {
        if (onPublishDevWeb) {
            publishDev()
        } else {
            nodemon({
                watch: [path.resolve(__dirname, 'dev/server/**')],
                script: path.resolve(__dirname, 'dev/server/app.js'),
            })
            fs.watchFile(path.resolve(__dirname, 'dev/client/app.js'), () => {
                browserSync.init(null, {
                    proxy: "http://localhost:8000",
                    files: [path.resolve(__dirname, 'dev/**')],
                    port: 5343,
                });
                fs.unwatchFile(path.resolve(__dirname, 'dev/client/app.js'))
            })
        }
    }
}

const checkDevs = (done) => {
    for (let arg of process.argv) {
        arg = arg.split('-')
        let found = false
        for (let temp of arg) {
            if (temp == 'delete') {
                found = true
            }
        }
        if (found) {
            let Tdevs = []
            let not = []
            for (let temp of arg) {
                if (temp != '' && temp != 'delete') {
                    if (temp == 'start' || temp == 'heroku') {
                        Tdevs.push(temp)
                    } else
                        not.push(temp)
                }
            }
            for (const key of devs) {
                if (key != 'start' && key != 'heroku') {
                    let f = true
                    for (const key2 of not) {
                        if (key2 == key) {
                            f = false
                            break
                        }
                    }
                    if (f) Tdevs.push(key)
                }
            }
            devs = Tdevs
            return
        }
    }
    if (done) done()
}

// ------------------------------------------------------------------------
// ------------------------------------------------------------------------
// ------------------------------------------------------------------------

gulp.task('clean', () => {
    return gulp.src('dev', {
        read: false,
        allowEmpty: true
    })
        .pipe(clean());
});

gulp.task('assets', () => {
    return gulp.src(path.resolve(__dirname, 'app/assets/**'))
        .pipe(imagemin())
        .pipe(gulp.dest(path.resolve(__dirname, 'dev/assets')))
})

gulp.task('webpackClient', () => {
    webpackClientStream = gulp.src(path.resolve(__dirname, 'app/client/**'))
        .pipe(webpackStream(onPublishDevWeb ? require(path.resolve(__dirname, 'config/client/webpack.dev.js'))(['heroku']) : require(path.resolve(__dirname, 'config/client/webpack.dev.js'))(devs)));
    webpackClientStream.pipe(gulp.dest(path.resolve(__dirname, 'dev/client/')))
        .on('data', () => {
            if (!webpackClient) {
                afterStart()
                webpackClient = true
            }
        })
    return webpackClientStream
})

gulp.task('webpackServer', () => {
    webpackServerStream = gulp.src(path.resolve(__dirname, 'app/server/server_game/**'))
        .pipe(webpackStream(onPublishDevWeb ? require(path.resolve(__dirname, 'config/server/webpack.dev.js'))(['heroku']) : require(path.resolve(__dirname, 'config/server/webpack.dev.js'))(devs)));
    webpackServerStream.pipe(gulp.dest(path.resolve(__dirname, 'dev/server/server_game/')))
        .on('data', () => {
            if (!webpackServer) {
                afterStart()
                webpackServer = true
            }
        })
    return webpackServerStream
})

gulp.task('serverMain', () => {
    return gulp.src([path.resolve(__dirname, 'app/server/**'), `!${path.resolve(__dirname, 'app/server/server_game/**')}`])
        .pipe(onPublishDevWeb ? utls.deleteDev(['heroku']) : utls.next())
        .pipe(gulp.dest(path.resolve(__dirname, 'dev/server')))
})

gulp.task('copyPackageWeb', (done) => {
    fs.copyFileSync(path.resolve(__dirname, 'config/package.json'), path.resolve(__dirname, 'dev/package.json'))
    done()
})

gulp.task('watchWeb',
    gulp.parallel(checkDevs, 'webpackClient', 'webpackServer', 'assets', 'serverMain',
        () => {
            gulp.watch(path.resolve(__dirname, 'app/assets/**'), gulp.series('assets'))
        },
        () => {
            gulp.watch([path.resolve(__dirname, 'app/server/**'), `!${path.resolve(__dirname, 'app/server/server_game/**')}`], gulp.series('serverMain'))
        }
    )
)

gulp.task('default', gulp.series('clean', 'watchWeb'));


// ------------------------------------------------------------------------
// ------------------------------------------------------------------------
// ------------------------------------------------------------------------
// ------------------------------------------------------------------------

gulp.task('cleanBuild', () => {
    return gulp.src('dist', {
        read: false,
        allowEmpty: true
    })
        .pipe(clean());
});

gulp.task('assetsBuild', () => {
    return gulp.src(path.resolve(__dirname, 'app/assets/**'))
        .pipe(prettyData({ type: 'minify' }))
        .pipe(imagemin())
        .pipe(gulp.dest(path.resolve(__dirname, 'dist/assets')))
})


gulp.task('webpackClientBuild', () => {
    return gulp.src(path.resolve(__dirname, 'app/client/**'))
        .pipe(webpackStream(require(path.resolve(__dirname, 'config/client/webpack.prod.js'))(devs)))
        .pipe(gulp.dest(path.resolve(__dirname, 'dist/client/')))
})

gulp.task('webpackServerBuild', () => {
    return gulp.src(path.resolve(__dirname, 'app/server/server_game/**'))
        .pipe(webpackStream(require(path.resolve(__dirname, 'config/server/webpack.prod.js'))(devs)))
        .pipe(gulp.dest(path.resolve(__dirname, 'dist/server/server_game/')))
})

gulp.task('serverMainBuild', () => {
    return gulp.src([path.resolve(__dirname, 'app/server/**'), `!${path.resolve(__dirname, 'app/server/server_game/**')}`])
        .pipe(utls.deleteDev(['start', 'heroku']))
        .pipe(minify({
            ext: {
                min: '_t_e_m_p_.js'
            }
        }))
        .pipe(gulp.dest(path.resolve(__dirname, 'dist/server')))
        .on('end', () => {
            const unlinkRename = (tempPath) => {
                const tempDir = fs.readdirSync(tempPath)
                let files = []
                for (const name of tempDir) {
                    if (fs.statSync(tempPath + `/${name}`).isFile()) {
                        files.push(name)
                    } else {
                        unlinkRename(tempPath + `/${name}`)
                    }
                }
                let minified = []
                for (const file of files) {
                    if (!file.includes('_t_e_m_p_.js')) {
                        fs.unlinkSync(tempPath + `/${file}`)
                    } else {
                        minified.push(file)
                    }
                }
                for (const file of minified) {
                    fs.renameSync(tempPath + `/${file}`, tempPath + `/${file.slice(0, file.indexOf('_'))}.js`)
                }
            }
            const tempDir = path.resolve(__dirname, 'dist/server')
            unlinkRename(tempDir)
        })
})

// ------------------------------------------------------------------------

gulp.task('copyPackageBuildWeb', (done) => {
    fs.copyFileSync(path.resolve(__dirname, 'config/package.json'), path.resolve(__dirname, 'dist/package.json'))
    done()
})

gulp.task('buildWebAll', gulp.series(gulp.parallel('webpackClientBuild', 'webpackServerBuild', 'assetsBuild', 'serverMainBuild'), 'copyPackageBuildWeb'))


gulp.task('buildWeb', gulp.series(checkDevs, 'cleanBuild', 'buildWebAll'))


// ------------------------------------------------------------------------
// ------------------------------------------------------------------------
// ------------------------------------------------------------------------

gulp.task('publish', gulp.series('buildWeb', (done) => {
    const commad =
        `cd ${path.resolve(__dirname, 'dist')} && 
     git init && 
     git remote add dist ${gitConfig.devLink} && 
     git add . && 
     git commit --allow-empty -am "gulp auto publish" && 
     git push dist master --force &&
     git remote remove dist`
    const otherProcess = spawn(commad, {
        shell: true
    })

    otherProcess.stderr.pipe(process.stdout)
    otherProcess.stdout.pipe(process.stdout)

    otherProcess.on('close', () => {
        utls.deleteFolderRecursive(path.resolve(__dirname, 'dev/.git'))
        done()
    })
}))

gulp.task('publishDevHeroku', (done) => {
    let b_u_i_l_d__d_o_n_e = false
    for (const arg of process.argv) {
        if (arg == '--b_u_i_l_d__d_o_n_e') { }
        b_u_i_l_d__d_o_n_e = true
    }
    if (b_u_i_l_d__d_o_n_e) {
        gulp.parallel('copyPackageWeb')()
        const commad =
            `cd ${path.resolve(__dirname, 'dev')} && 
             git init && 
             git remote add dev ${gitConfig.devLink} && 
             git add . && 
             git commit --allow-empty -am "gulp auto publish" && 
             git push dev master --force &&
             git remote remove dev`
        const otherProcess = spawn(commad, {
            shell: true
        })

        otherProcess.stderr.pipe(process.stdout)
        otherProcess.stdout.pipe(process.stdout)

        otherProcess.on('close', () => {
            utls.deleteFolderRecursive(path.resolve(__dirname, 'dev/.git'))
            done()
        })
    } else {
        onPublishDevWeb = true
        gulp.parallel('default')()
    }
    finishPublishDev = () => {
        done()
        process.exit(0)
    }
})