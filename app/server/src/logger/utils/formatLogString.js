module.exports = (string) => {
    const time = getTime()
    if (string) return `[${time}] ${string}\n`
    else return `[${time}] NO INFO PROVIDED\n`
}



function getTime() {
    const date = new Date()
    const hours = String(date.getHours())
    const minutes = String(date.getMinutes())
    const seconds = String(date.getSeconds())

    return `${hours.length == 1 ? `0${hours}` : hours}:${minutes.length == 1 ? `0${minutes}` : minutes}:${seconds.length == 1 ? `0${seconds}` : seconds}`
}