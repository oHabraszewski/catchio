module.exports = (socket, room) => {
    room.playersCount++
    
    socket.room = room
    room.players[socket.id] = {
        socket,
        score: 0,
        sprite: null,
        ghost: true
    }
}