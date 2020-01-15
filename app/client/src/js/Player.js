//Plik zawierający ogólną klasę gracza
import Phaser from 'phaser';
import { Canvas, Scale } from "./config/Screen";


class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, ) {
    super(scene, x, y, texture);

    this.human = true
    this.ball = null
    this.jumpSpeed = -Canvas.height;
    this.acceleration = Canvas.width / 2;

    scene.add.existing(this);
    scene.physics.world.enable(this);

    this.body.setCollideWorldBounds(true);
    this.body.setMaxVelocity(Canvas.width / 5, 2000);
    this.body.setDragX(1000);

    this.cursors = scene.input.keyboard.createCursorKeys();
  }

  setHuman(flag) {
    this.human = flag
  }

  walk() {
    if (this.cursors.left.isDown) { // Ruch w lewo
      this.body.setAccelerationX(-this.acceleration);

    } else if (this.cursors.right.isDown) { // Ruch w prawo
      this.body.setAccelerationX(this.acceleration);

    } else {
      this.body.setAccelerationX(0);

    }
    if (this.cursors.up.isDown && this.body.blocked.down && this.body.velocity.y == 0 && !(this.body.blocked.up)) { // Skok
      this.body.setVelocityY(this.jumpSpeed);
    }
  }

  // static getBall(player1, player2) {
  //   if (player1.ball == null && player2.ball == null) return
  //   if (canGet) {

  //     if (player1.ball == null) { //Player 1 ma piłkę, Player 2 ni ma piłki
  //       const temp = player1
  //       player1 = player2
  //       player2 = temp
  //     }
  //     console.log('player2.cursors.down.isDown')
  //     if (player2.cursors.down.isDown) {

  //       player2.ball = player1.ball
  //       player2.ball.owner = player2
  //       player1.ball = null

  //       canGet = false
  //       setTimeout(() => { canGet = true }, 1000)
  //     }
  //   }

  //   // swap the ball based on keys
  //   // console.log(player1.ball == null)
  // }
}

export default Player;
