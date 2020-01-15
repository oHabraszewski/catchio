const addRoom = require('.//addRoom')
const removeRoom = require('./removeRoom')

const data = require('../../data')

module.exports = () => {
    const roomIds = Object.keys(data.rooms)
    for (const roomId of roomIds) {
        const room = data.rooms[roomId]
        if (room.playersCount == 0 && roomId != roomIds[roomIds.length - 1]) removeRoom(roomId)
    }

    if (data.rooms[roomIds[roomIds.length - 1]].playersCount == data.const.MAX_PLAYERS_IN_ROOM) addRoom()
}