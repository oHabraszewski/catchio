import { Scale } from '../config/Screen'

export default function () {
    this.socket.on('updateOtherPlayer', (otherPlayer) => {
        this.otherPlayer.setPosition(otherPlayer.x * Scale, otherPlayer.y * Scale)
    })

    this.socket.on('newBallOwner', () => {
        console.log(`newBallOwner`)
        const ball = this.player.ball
        this.otherPlayer.ball = ball
        ball.owner = this.otherPlayer

        this.player.ball = null
    })

    // update ball state
}