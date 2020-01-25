const data = require('../../data')

const { log } = require('../../../logger/logger')

module.exports = (room) => {
    if (room != undefined && room.playersCount != data.const.MIN_PLAYERS_IN_ROOM_TO_START_GAME) {
        log(`${room.id} <- Stopping game`)
        room.emit('stopGame')
        room.gameplay = false
        room.off(['newPos', 'newBallOwner', 'restart'])
    }
}