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
        this.owner;
        scene.add.existing(this);
    }

    getOwner(ball, player){
      ball.owner = player;
    }
    moveToPlayer(){
      this.startFollow(this.owner)
      /* if (this.owner != null){
        this.x = this.owner.x;
        this.y = this.owner.y;
      } */
    }
    removeOwner(){
      this.owner = null;
    }
}
export default Ball;
