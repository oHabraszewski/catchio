//Plik zawierający klasę piłki - obiektu który będziemy kraść i rzucać do bramek
import Phaser from 'phaser';

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

    moveToPlayer() {
        if (this.owner != null) {
            this.scene.physics.moveToObject(this, this.owner, 1000, 100)
        }
    }
    removeOwner() {
        this.owner.ball = null
        this.owner = null;
    }

    static setOwner(ball, player) {
        //this.scene.pause() Mini test
        //setTimeout(()=>{console.log(this);this.scene.resume("default")}, 500)
        let canGet = true;
        let player1 = this.ents.playerWASD
        let player2 = this.ents.playerArrows
        if (player1.ball == null && player2.ball == null) {
            player.ball = ball
            ball.owner = player
        } else {
            if (canGet && player.ball != ball ) {
                if (player1.ball == null) { //Player 1 ma piłkę, Player 2 ni ma piłki
                    const temp = player1
                    player1 = player2
                    player2 = temp
                }

                player2.ball = player1.ball
                player2.ball.owner = player2
                player1.ball = null
                canGet = false
                setTimeout(() => {
                    canGet = true
                }, 1000)
            }
        }

        //this.ents.startOverlap.destroy();
        //this.ents.startOverlap2.destroy();
    }
}
export default Ball;