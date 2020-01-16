export default function () {
    this.socket.on('updateOtherPlayer', (otherPlayer) => {
        this.otherPlayer.setPosition(otherPlayer.x, otherPlayer.y)
        this.otherPlayer.body.setVelocity(otherPlayer.xVel, otherPlayer.yVel)
    })

    this.socket.on('newBallOwner', () => {
        const ball = this.player.ball
        this.otherPlayer.ball = ball
        ball.owner = this.otherPlayer

        this.player.ball = null
    })

}