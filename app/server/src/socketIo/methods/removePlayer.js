const reromataPlayers = require('./room/reromataPlayers')
const goodNumberOfRooms = require('./room/goodNumberOfRooms')
const removePlayer = require('./player/removePlayer')

const stopGame = require('./game/stopGame')

const data = require('../data')



module.exports = (socket) => {
    const room = socket.room

    removePlayer(socket)

    stopGame(room)
    
    reromataPlayers()
    goodNumberOfRooms()

    console.log(data.rooms)
}


