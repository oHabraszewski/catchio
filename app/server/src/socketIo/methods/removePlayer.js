const reromataPlayers = require('./room/reromataPlayers')
const goodNumberOfRooms = require('./room/goodNumberOfRooms')
const removePlayer = require('./player/removePlayer')

const stopGame = require('./game/stopGame')

const data = require('../data')

const { log } = require('../../logger/logger')


module.exports = (socket) => {
    const room = socket.room

    log(`${socket.id} <- Removing player`)
    removePlayer(socket)

    stopGame(room)

    reromataPlayers()
    goodNumberOfRooms()
    log(`Rooms count: ${Object.keys(data.rooms).length}`)

    console.log(data.rooms)
}


