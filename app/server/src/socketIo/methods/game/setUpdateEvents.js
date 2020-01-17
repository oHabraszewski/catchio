module.exports = (room) => {

    room.on('newPos', (newPos, player) => {
        if (player.socket != undefined) {
            room.everyOther(player.socket.id, 'updateOtherPlayer', newPos)
        }
    })

    room.on('newBallOwner', (player) => {
        if (player.socket != undefined) {
            room.everyOther(player.socket.id, 'newBallOwner')
        }
    })

    let restartEvent = true
    room.on('restart', (player) => {
        if (restartEvent && room.gameplay) {
            room.emit('stopGame')
            restartEvent = false
            room.gameplay = false
            player.score++

            const score = {}
            for (const playerId in room.players) {
                const player = room.players[playerId]
                score[player.socket.id] = player.score
            }

            startGame(room, false, { score })
            setTimeout(() => { restartEvent = true }, 4000);
        }
    })
    
}