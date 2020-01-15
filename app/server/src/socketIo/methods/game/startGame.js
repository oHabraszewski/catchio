const data = require('../../data')
const generateConfigs = require('./generateConfigs')

module.exports = (room) => {
    if (room.playersCount == data.const.MIN_PLAYERS_IN_ROOM_TO_START_GAME) {
        room.emit('startGame', generateConfigs(room))

        room.on('newPos', (newPos, player) => {
            if (player.socket != undefined) {
                room.everyOther(player.socket.id, 'updateOtherPlayer', newPos)
            }
        })

        room.on('newBallOwner', (player) => {
            if (player.socket != undefined) {
                room.everyOther(player.socket.id, 'newBallOwner')
            }
        })

    }
}

