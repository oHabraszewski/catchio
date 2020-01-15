const goodNumberOfRooms = require('./room/goodNumberOfRooms')
const addRoom = require('./room/addRoom'); addRoom() // add first room
const addPlayer = require('./player/addPlayer')

const startGame = require('./game/startGame')

const data = require('../data')



module.exports = (socket) => {
    goodNumberOfRooms()
    const playersRoom = findPlayersRoom()
    
    addPlayer(socket, playersRoom)
    startGame(playersRoom) // if can start game
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

