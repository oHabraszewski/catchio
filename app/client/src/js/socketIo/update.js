import { Scale } from '../config/Screen'

export function updatePos() {
    this.socket.emit('newPos', {
        x: this.player.x / Scale,
        y: this.player.y / Scale
    })
}

export function updateBallOwner() {
    this.socket.emit('newBallOwner')
}
