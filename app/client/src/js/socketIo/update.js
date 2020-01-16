export function updatePos() {
    this.socket.emit('newPos', {
        x: this.player.x,
        y: this.player.y,
        xVel: this.player.body.velocity.x,
        yVel: this.player.body.velocity.y
    })
}

export function updateBallOwner() {
    this.socket.emit('newBallOwner')
}
