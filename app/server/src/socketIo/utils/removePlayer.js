const goodNumberOfRooms = require('./room/goodNumberOfRooms')
const removePlayer = require('./player/removePlayer')

const data = require('../data')



module.exports = (socket) => {
    removePlayer(socket)
    goodNumberOfRooms()

    // "reromate" players
    console.log(data.rooms)
}


