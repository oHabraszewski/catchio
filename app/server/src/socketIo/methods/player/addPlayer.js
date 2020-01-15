module.exports = (socket, room) => {
    room.playersCount++
    
    socket.room = room
    room.players[socket.id] = {
        socket,
        ghost: true
    }
}