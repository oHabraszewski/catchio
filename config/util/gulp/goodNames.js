const path = require('path')

const through = require('through2')

module.exports = function goodNames(hash) {
    return through({
        objectMode: true
    }, (file, encoding, cb) => {
        const basename = path.basename(file.path)
        if (basename.includes(hash)) {
            file.path = file.path.replace(hash, '')
            cb(null, file)
        }
        else cb(null, null)
    })
}

