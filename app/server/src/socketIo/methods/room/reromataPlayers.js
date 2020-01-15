const data = require('../../data')
const addPlayer = require('../player/addPlayer')
const removePlayer = require('../player/removePlayer')

const startGame = require('../game/startGame')
module.exports = () => {
    const alonePlayers = []
    for (const roomId in data.rooms) {
        const room = data.rooms[roomId]
        if (room.playersCount == 1) {
            const playerId = Object.keys(room.players)[0]
            alonePlayers.push({
                room: room,
                id: playerId
            })
        }
    }

    if (alonePlayers.length > 0) {
        let i = 0
        for (const roomId in data.rooms) {
            const room = data.rooms[roomId]
            if (data.const.MAX_PLAYERS_IN_ROOM > room.playersCount) {
                const player = alonePlayers[i].room.players[alonePlayers[i].id]
                removePlayer(player.socket)
                addPlayer(player.socket, room)
                startGame(room)
            }
        }
    }
}