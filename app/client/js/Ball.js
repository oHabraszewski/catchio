//Plik zawierający klasę piłki - obiektu który będziemy kraść i rzucać do bramek
'use strict';
import Phaser from 'phaser';

class Ball extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene,x, y, texture);
        // ...
        scene.physics.world.enable(this);
        this.body.setDragX(300);
        this.body.setCollideWorldBounds(true);
        scene.add.existing(this);
        this.check;
        this.followedPlayer;
        this.triggered;
    }

    moveToPlayer(ball, player){
        ball.x = player.x;
        ball.y = player.y;

      }
}
export default Ball;
