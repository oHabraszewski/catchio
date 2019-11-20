//Plik zawierający ogólną klasę gracza
'use strict';
import Phaser from 'phaser';
import Screen from "./config/Screen.js";

class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, texture) {
        super(scene, x, y, texture);

        this._scene = scene;
        scene.physics.world.enable(this);
        this.body.setCollideWorldBounds(true);
        this.movementSpeed = Screen.width/3;
        this.jumpSpeed = Screen.height/-1;
        scene.add.existing(this);
    }

    walk(cursors){

      if (cursors.left.isDown) {                        //Ruch w lewo
        this.body.setVelocityX(-this.movementSpeed);
    }
    else  if (cursors.right.isDown) {                   //Ruch w prawo
      this.body.setVelocityX(this.movementSpeed);
    }
    else {
      this.body.setVelocityX(0);
   }
   if (cursors.up.isDown && this.body.blocked.down) {   //Skok
     this.body.setVelocityY(this.jumpSpeed);
   }

  }
}


export default Player;
