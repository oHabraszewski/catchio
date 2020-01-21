import gamplay from './gamplay'

export default function () {
    const socket = this.socket

    socket.once('checkGhost', () => {
        socket.emit('checkGhost')
    })

    socket.on('startGame', (gameConfig) => {
        // console.log(`start game: `, gameConfig)
        console.log(gameConfig)
        if (gameConfig.score) {
            rearengeScore.call(this, gameConfig.score)
        }

        if (this.gameplay) this.stop()
        this.start(gameConfig)
    })

    socket.on('stopGame', (hard) => {
        this.stop(hard)
    })

    gamplay.call(this)
}

function rearengeScore(score) {
    const thisPlayerScore = score[this.socket.id]
    delete score[this.socket.id]
    const otherPlayerScore = Object.values(score)[0]

    this.points[this.player.pointsIndex] = thisPlayerScore
    this.points[this.otherPlayer.pointsIndex] = otherPlayerScore
    this.ents.interface.updatePoints(this.points[0], this.points[1])

}