const path = require('path')
const { Readable } = require('stream')
const fs = require('fs-extra')
const promisify = require('util').promisify

const fsP = {
    appendFile: promisify(fs.appendFile),
    readFile: promisify(fs.readFile),
    readdir: promisify(fs.readdir)
}

const formatLogString = require('./utils/formatLogString')

const logPath = path.join(__dirname, '../../logs')
let logsFile = null
let logsStream = new Readable({ read: () => { } })
let logged = false

function createLogsFile() {
    const date = new Date()
    const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

    logsFile = `${logPath}/${dateStr}.txt`

    fs.mkdirSync(logPath, { recursive: true })
    fs.writeFileSync(logsFile, formatLogString('STARTING LOGS'))
}

async function getLogsNow() {
    let logs = ''
    try { logs = await fsP.readFile(logsFile) } catch (e) { error(e) }
    return logs
}

function getLogsNowStream() { return logsStream }

async function getLogs(date) {
    let logs = 'Not found logs file'
    try { logs = await fsP.readFile(`${logPath}/${date}.txt`) } catch (e) { (!e.message.includes('ENOENT')) ? error(e) : null }
    return logs
}

async function getDates() {
    let datesStr = ''
    try {
        const dates = await fsP.readdir(`${logPath}/`)
        datesStr = dates.reduce((prev, curr) => prev + '\n' + curr.split('.txt')[0], '')
        if (datesStr == '') datesStr = 'none'
    } catch (e) { error(e) }

    return datesStr
}

async function log(string) {
    logged = true
    let appended = undefined
    try {
        appended = formatLogString(string)
        await fsP.appendFile(logsFile, formatLogString(string))
    } catch (e) {
        try {
            appended = formatLogString(e)
            await fsP.appendFile(logsFile, formatLogString(e))
        } catch (e) { error(e) }
    }
    logsStream.push(appended)
}


function error(e) { console.error(`ERROR LOGGING: `, e) }

module.exports = {
    getLogs,
    getLogsNow,
    getLogsNowStream,
    getDates,
    createLogsFile,
    log
}


process.on('beforeExit', () => {
    if (logged == false) fs.unlinkSync(logsFile)
})
