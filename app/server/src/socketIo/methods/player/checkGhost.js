const data = require('../../data')
const removePlayer = require('../removePlayer')

module.exports = (socket) => {
    setTimeout(() => {
        socket.emit('checkGhost')

        setTimeout(() => {
            if (socket.room != undefined && socket.room.players[socket.id] != undefined &&
                socket.room.players[socket.id].ghost) removePlayer(socket)
        }, 500);

        socket.once('checkGhost', () => {
            console.log('not ghost! ' + socket.id)
            if (socket.room != undefined && socket.room.players[socket.id] != undefined
            ) socket.room.players[socket.id].ghost = false
        })

    }, 5000);
}
