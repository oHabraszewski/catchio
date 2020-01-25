const goodNumberOfRooms = require('./room/goodNumberOfRooms')
const addRoom = require('./room/addRoom'); addRoom() // add first room
const addPlayer = require('./player/addPlayer')

const startGame = require('./game/startGame')

const data = require('../data')

const { log } = require('../../logger/logger')


module.exports = (socket) => {
    goodNumberOfRooms()
    const playersRoom = findPlayersRoom()

    log(`${socket.id} <- Adding player, room id: ${playersRoom.id}`)

    addPlayer(socket, playersRoom)
    startGame(playersRoom) // if can start game

    log(`Rooms count: ${Object.keys(data.rooms).length}`)
    
    console.log(data.rooms)
}


function findPlayersRoom() {
    const rooms = Object.values(data.rooms)
    rooms.sort((a, b) => b.playersCount - a.playersCount)
    for (const room of rooms) {
        if (data.const.MAX_PLAYERS_IN_ROOM > room.playersCount) {
            return room
        }
    }
}

