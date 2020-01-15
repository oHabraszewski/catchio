const data = require('../../data')

module.exports = () => {
    data.roomsId++
    data.rooms[data.roomsId] = {
        players: {},
        playersCount: 0
    }
}