module.exports = (socket) => {
    const room = socket.room
    room.playersCount--

    delete socket.room
    delete room.players[socket.id]
}