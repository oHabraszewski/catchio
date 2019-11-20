//Plik zawierający ogólną klasę gracza
'use strict';
import Phaser from 'phaser';
import Screen from "./config/Screen.js";

class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, texture) {
        super(scene, x, y, texture);

        this._cursors  = scene.input.keyboard.createCursorKeys();
        scene.physics.world.enable(this);
        this.body.setCollideWorldBounds(true);
        this.movementSpeed = Screen.width/3;
        this.jumpSpeed = Screen.height/-1;
        scene.add.existing(this);
    }

    walk(){

      if (this._cursors.left.isDown) {                        //Ruch w lewo
        this.body.setVelocityX(-this.movementSpeed);
    }
    else  if (this._cursors.right.isDown) {                   //Ruch w prawo
      this.body.setVelocityX(this.movementSpeed);
   }
    else {
      this.body.setVelocityX(0);
   }
  if (this._cursors.up.isDown && (this.body.blocked.down || this.body.touching.down)) {   //Skok
     this.body.setVelocityY(this.jumpSpeed);
  }

  }
}


export default Player;
