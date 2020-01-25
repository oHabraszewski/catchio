export default function () {
    this.socket.on('updateOtherPlayer', (otherPlayer) => {
        if (this.gameplay) {
            this.otherPlayer.setPosition(otherPlayer.x, otherPlayer.y)
            this.otherPlayer.body.setVelocity(otherPlayer.xVel, otherPlayer.yVel)
        }
    })

    this.socket.on('newBallOwner', () => {
        if (this.gameplay) {
            const ball = this.ents.ball
            this.otherPlayer.ball = ball
            ball.owner = this.otherPlayer

            this.player.ball = null
        }
    })
}