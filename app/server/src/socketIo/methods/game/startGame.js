const data = require('../../data')
const generateConfigs = require('./generateConfigs')

const { log } = require('../../../logger/logger')

function startGame(room, changePlayers, addToConf = {}) {
    log(`${room.id} <- Starting game`)
    room.emit('startGame', { ...generateConfigs(room, changePlayers), ...addToConf })
    room.gameplay = true
}

module.exports.startGame = startGame

const setUpdateEvents = require('./setUpdateEvents')

module.exports = (room) => {
    if (room.playersCount == data.const.MIN_PLAYERS_IN_ROOM_TO_START_GAME) {
        setUpdateEvents(room)
        startGame(room)
    }
}


