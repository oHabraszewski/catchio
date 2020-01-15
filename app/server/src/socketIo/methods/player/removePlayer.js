module.exports = (socket) => {
    if (socket.room != undefined) {
        const room = socket.room
        room.playersCount--

        delete socket.room
        delete room.players[socket.id]
    }
}