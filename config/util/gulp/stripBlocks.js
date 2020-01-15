const through = require('through2')

const stripBlocksConst = require('./const').stripBlocks
const removeStripBlocks = require('./../removeStripBlocks.js')

module.exports.makeStripBlocks = function (strpBlocksTabToLeve) {
    let done = []
    for (const stripBlockConst of stripBlocksConst) {
        let del = true
        for (const stripBlock of strpBlocksTabToLeve) {

            if (stripBlockConst.base == stripBlock.base &&
                (stripBlockConst.key == stripBlock.key || stripBlock.key == undefined)
            ) del = false
        }

        if (del) done.push(stripBlockConst)
    }

    return done
}

module.exports.gulpDeleteStripBlocks = function gulpDeleteStripBlocks(stripBlocks) {
    return through({
        objectMode: true
    }, (file, encoding, cb) => {
        if (file.isNull()) {
            cb(null, file);
            return;
        }

        for (const stripBlock of stripBlocks) {
            let temp = file.contents
            temp = temp.toString()
            temp = removeStripBlocks(`${stripBlock.base}:${stripBlock.key || 'start'}`, `${stripBlock.base}:end`, temp)
            file.contents = Buffer.from(temp)
        }

        cb(null, file)

    })

}