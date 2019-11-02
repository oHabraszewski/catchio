const through = require('through2')

const deleteFolderRecursive = (path) => {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

const deleteDev = (keys) => {
    return through({
        objectMode: true
    }, (file, encoding, cb) => {

        if (file.isNull()) {
            cb(null, file);
            return;
        }

        if (file.isStream()) {
            cb(new gutil.PluginError('gulp-delete-dev', 'Streaming not supported'));
            return;
        }

        for (const key of keys) {
            const regexPattern = new RegExp("[\\t ]*\\/\\* ?" + `develblock:${key}` + " ?\\*\\/[\\s\\S]*?\\/\\* ?" + 'develblock:end' + " ?\\*\\/[\\t ]*\\n?", "g");
            file.contents = Buffer.from(file.contents.toString().replace(regexPattern, ''))
        }

        cb(null, file)

    })
}

const validatePathCordova = () => {
    return through({
        objectMode: true
    }, (file, encoding, cb) => {
        const regexPattern = new RegExp("/assets", "g");

        if (file.isNull()) {
            cb(null, file);
            return;
        }

        if (file.isStream()) {
            cb(new gutil.PluginError('gulp-delete-dev', 'Streaming not supported'));
            return;
        }
        file.contents = Buffer.from(file.contents.toString().replace(regexPattern, './assets'))
        cb(null, file)

    })
}

const next = () => {
    return through({
        objectMode: true
    }, (file, encoding, cb) => {
        cb(null, file)
    })
}
module.exports = {
    deleteFolderRecursive,
    deleteDev,
    validatePathCordova,
    next
}


