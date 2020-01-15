const checkGhost = require('./methods/player/checkGhost')
const addPlayer = require('./methods/addPlayer')
const removePlayer = require('./methods/removePlayer')

module.exports = (socket) => {
    addPlayer(socket)

    checkGhost(socket)
    socket.on('disconnect', () => {
        removePlayer(socket)
    })
}