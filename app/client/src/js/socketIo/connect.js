import gamplay from './gamplay'

export default function () {
    const socket = this.socket

    socket.once('checkGhost', () => {
        socket.emit('checkGhost')
    })

    socket.on('startGame', (gameConfig) => {
        console.log(`start game: `, gameConfig)
        this.start(gameConfig)
    })

    socket.on('stopGame', () => {
        this.stop()
        console.log(`stop game`)
    })  

    gamplay.call(this)
}