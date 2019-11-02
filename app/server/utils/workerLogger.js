module.exports = (pid) => {
    return (message) => {
        console.log(`from ${pid} => ${message}`)
    }
}