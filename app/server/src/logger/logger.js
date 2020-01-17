const path = require('path')
const logPath = path.join(__dirname, '../../logs')
let logFileName = null

const fs = require('fs')
const promisify = require('util').promisify

const fsP = {
    readFile: promisify(fs.readFile),
    readdir: promisify(fs.readdir)
}

function createLogsFile() {
    const date = new Date()
    const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}:${date.getMinutes()}.${date.getSeconds()}`
    logFileName = dateStr
    fs.writeFileSync(`${logPath}/${dateStr}.txt`, '')
}

async function getLogsNow() {
    const logs = await fsP.readFile(`${logPath}/${logFileName}.txt`)
    return logs
}

async function getLogs(date) {
    let logs = 'Not found log file'
    
    try { logs = await fsP.readFile(`${logPath}/${date}.txt`) } catch (err) { }

    return logs
}

async function getDates() {
    const dates = await fsP.readdir(`${logPath}/`)
    let datesStr = dates.reduce((prev, curr) => prev + curr.split('.txt')[0], '')
    if (datesStr == '') datesStr = 'none'
    return datesStr
}

module.exports = {
    getLogs,
    getLogsNow,
    getDates,
    createLogsFile
}
