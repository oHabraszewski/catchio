//Plik zawierający klasę piłki - obiektu który będziemy kraść i rzucać do bramek
import Phaser from 'phaser';
import { updateBallOwner } from './socketIo/update'

let canGet = true;
class Ball extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        this.owner = null;

        scene.add.existing(this);
        scene.physics.world.enable(this);
        this.scene = scene

        this.body.setDragX(300);
        this.body.setCollideWorldBounds(true);
    }

    moveToPlayer(game) {
        if (this.owner != null) {
            this.scene.physics.moveToObject(this, this.owner, 1000, 100)

            const a = Math.abs(this.body.x - this.owner.body.x)
            const b = Math.abs(this.body.y - this.owner.body.y)
            const distanceToOwner = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2))

            if (distanceToOwner > 45) {
                game.ents.colls.bl.overlapOnly = true
            } else {
                if (game.ents.colls.bl.overlapOnly) game.ents.colls.bl.overlapOnly = false
            }
        }

        if (this.body.velocity.x > 5.5 || this.body.velocity.x < -5.5)
            this.body.setAngularVelocity((this.body.velocity.x + this.body.velocity.y) / 2)
        else this.body.setAngularVelocity(0)
    }

    removeOwner() {
        this.owner.ball = null
        this.owner = null;
    }

    static setOwner(ball, player) {
        let player1 = this.ents.player1
        let player2 = this.ents.player2

        if (player1.ball == null && player2.ball == null) {
            player.ball = ball
            ball.owner = player

            console.log('updateBallOwner: first')
            updateBallOwner.call(this)

        } else {
            if (canGet && player.ball != ball /*&& (player.keys.S.isDown || player.cursors.down.isDown)*/) {
                if (player1.ball == null) { //Player 1 ma piłkę, Player 2 ni ma piłki
                    const temp = player1
                    player1 = player2
                    player2 = temp
                }

                if (player2.cursors.down.isDown || player2.keys.S.isDown) {
                    console.log('updateBallOwner: next')
                    updateBallOwner.call(this)
                    player2.ball = player1.ball
                    player2.ball.owner = player2
                    player1.ball = null
                    canGet = false
                    setTimeout(() => { canGet = true }, 1000)
                }
            }
        }
    }
}
export default Ball;