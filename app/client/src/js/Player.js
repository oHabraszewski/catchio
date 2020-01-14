//Plik zawierający ogólną klasę gracza
import Phaser from 'phaser';
import { Screen } from "./config/Screen";



class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    this.jumpSpeed = -Screen.height;
    this.acceleration = Screen.width / 2;

    scene.add.existing(this);
    scene.physics.world.enable(this);

    this.body.setCollideWorldBounds(true);
    this.body.setMaxVelocity(Screen.width / 5, 2000);
    this.body.setDragX(1000);

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keys = scene.input.keyboard.addKeys('W,S,A,D');
  }


  walk() {

    if (this.cursors.left.isDown) { // Ruch w lewo
      this.body.setAccelerationX(-this.acceleration);

    } else if (this.cursors.right.isDown) { // Ruch w prawo
      this.body.setAccelerationX(this.acceleration);

    } else {
      this.body.setAccelerationX(0);

    }
    if (this.cursors.up.isDown && (this.body.blocked.down || this.body.touching.down)) { // Skok
      this.body.setVelocityY(this.jumpSpeed);

    }

  }

  alternativeWalk() {
    if (this.keys.A.isDown) { // Ruch w lewo

      this.body.setAccelerationX(-this.acceleration);
    } else if (this.keys.D.isDown) { // Ruch w prawo
      this.body.setAccelerationX(this.acceleration);

    } else {
      this.body.setAccelerationX(0);

    }
    if (this.keys.W.isDown && (this.body.blocked.down || this.body.touching.down)) { // Skok
      this.body.setVelocityY(this.jumpSpeed);

    }
  }

  static getBall(player1, player2) {
    console.log(player1, player2)
  }
}

export default Player;
