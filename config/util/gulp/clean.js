const path = require('path')

const gulp = require('gulp')
const del = require('del')

const envs = require('./const.js').envs

module.exports = (dirname) => {
    for (const env of envs) {
        const taskName = `util:clean:${env}`
        gulp.task(taskName, () => {
            return del([
                path.join(dirname, env, '/**')
            ])
        })
    }
}