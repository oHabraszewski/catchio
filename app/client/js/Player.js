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
        this.keys = scene.input.keyboard.addKeys('W,S,A,D');
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
    alternativeWalk(){
      if (this.keys.A.isDown) {                        //Ruch w lewo
        this.body.setVelocityX(-this.movementSpeed);
    }
    else  if (this.keys.D.isDown) {                   //Ruch w prawo
      this.body.setVelocityX(this.movementSpeed);
    }
    else {
      this.body.setVelocityX(0);
    }
    if (this.keys.W.isDown && (this.body.blocked.down || this.body.touching.down)) {   //Skok
      this.body.setVelocityY(this.jumpSpeed);
    }
    }

}

/*if (this._cursors.left.isDown || this.keys.A.isDown) {                        //Ruch w lewo
  this.body.setVelocityX(-this.movementSpeed);
}
else  if (this._cursors.right.isDown || this.keys.D.isDown) {                   //Ruch w prawo
this.body.setVelocityX(this.movementSpeed);
}
else {
this.body.setVelocityX(0);
}
if ((this._cursors.up.isDown || this.keys.W.isDown) && (this.body.blocked.down || this.body.touching.down)) {   //Skok
this.body.setVelocityY(this.jumpSpeed);
}

        Kod do ogolnego chodzenia (nie do lana)
*/

export default Player;
