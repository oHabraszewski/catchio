const checkGhost = require('./utils/player/checkGhost')
const addPlayer = require('./utils/addPlayer')
const removePlayer = require('./utils/removePlayer')

module.exports = (socket) => {
    addPlayer(socket)

    checkGhost(socket)
    socket.on('disconnect', () => {
        removePlayer(socket)
    })
}