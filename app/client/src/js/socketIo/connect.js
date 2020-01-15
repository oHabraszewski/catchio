export default (socket) => {

    socket.once('checkGhost', () => {
        socket.emit('checkGhost')
    })

    socket.on('startGame', (gameConfig) => {
        console.log(`start game: `, gameConfig)
    })

    socket.on('stopGame', () => {
        console.log(`stop game`)
    })
}