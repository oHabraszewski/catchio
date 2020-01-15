const through = require('through2')

module.exports = function nextGulp() {
    return through({
        objectMode: true
    }, (file, encoding, cb) => {
        cb(null, file)
    })
}