const data = require('../../data')

module.exports = (room) => {
    if (room != undefined && room.playersCount != data.const.MIN_PLAYERS_IN_ROOM_TO_START_GAME) {
        room.emit('stopGame')
        room.gameplay = false
        room.off(['newPos', 'newBallOwner', 'restart'])
    }
}