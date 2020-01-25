const removePlayer = require('../removePlayer')

const { log } = require('../../../logger/logger')

module.exports = (socket) => {
    setTimeout(() => {
        socket.emit('checkGhost')

        setTimeout(() => {
            if (socket.room != undefined && socket.room.players[socket.id] != undefined && socket.room.players[socket.id].ghost) {
                log(`${socket.id} <- Ghost`)
                removePlayer(socket)
            }
        }, 500);

        socket.once('checkGhost', () => {
            if (socket.room != undefined && socket.room.players[socket.id] != undefined) {
                log(`${socket.id} <- Not ghost`)
                socket.room.players[socket.id].ghost = false
            }
        })

    }, 5000);
}
