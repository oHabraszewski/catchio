const path = require('path')
const logPath = path.join(__dirname, '../../logs')

const fs = require('fs')
const promisify = require('util').promisify

const fsP = {
    readFile: promisify(fs.readFile),
    readdir: promisify(fs.readdir)
}

async function getLogs(date) {
    const logs = await fsP.readFile(`${logPath}/${date}.txt`)
    return logs
}

async function getDates() {
    const dates = await fsP.readdir(`${logPath}/`)
    return dates.join('\n')
}

module.exports = {
    getLogs,
    getDates
}
