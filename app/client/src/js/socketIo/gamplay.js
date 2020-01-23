export default function () {
    this.socket.on('updateOtherPlayer', (otherPlayer) => {
        if (this.gamplay) {
            this.otherPlayer.setPosition(otherPlayer.x, otherPlayer.y)
            this.otherPlayer.body.setVelocity(otherPlayer.xVel, otherPlayer.yVel)
        }
    })

    this.socket.on('newBallOwner', () => {
        if (this.gamplay) {
            const ball = this.ents.ball
            this.otherPlayer.ball = ball
            ball.owner = this.otherPlayer

            this.player.ball = null
        }
    })
}