export default (socket) => {

    socket.once('checkGhost', () => {
        socket.emit('checkGhost')
    })
}