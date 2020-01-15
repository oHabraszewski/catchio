import gamplay from './gamplay'

export default function () {
    const socket = this.socket

    socket.once('checkGhost', () => {
        socket.emit('checkGhost')
    })

    socket.on('startGame', (gameConfig) => {
        // console.log(`start game: `, gameConfig)
        if(this.gameplay) this.stop()
        this.start(gameConfig)
    })

    socket.on('stopGame', () => {
        console.log(`stop game`)
        this.stop()
    })  

    gamplay.call(this)
}