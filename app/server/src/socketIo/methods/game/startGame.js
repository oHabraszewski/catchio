const data = require('../../data')
const generateConfigs = require('./generateConfigs')

module.exports = (room) => {
    if (room.playersCount == data.const.MIN_PLAYERS_IN_ROOM_TO_START_GAME) {
        const { configs, forEachPlayer } = generateConfigs(room)
        room.emitForEachPlayer('startGame', configs, forEachPlayer)
    }
}

