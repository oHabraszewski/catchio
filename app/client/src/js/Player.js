//Plik zawierający ogólną klasę gracza
import Phaser from 'phaser';
import { Canvas, Scale } from "./config/Screen";



class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    this.ball = null
    this.jumpSpeed = -Canvas.height;
    this.acceleration = Canvas.width / 2;

    scene.add.existing(this);
    scene.physics.world.enable(this);

    this.body.setCollideWorldBounds(true);
    this.body.setMaxVelocity(Canvas.width / 5, 2000);
    this.body.setDragX(1000);

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keys = scene.input.keyboard.addKeys('W,S,A,D');
  }


  walk() {
    let isY = true;
    if (this.cursors.left.isDown) { // Ruch w lewo
      this.body.setAccelerationX(-this.acceleration);
    } else if (this.cursors.right.isDown) { // Ruch w prawo
      this.body.setAccelerationX(this.acceleration);
    } else {
      this.body.setAccelerationX(0);
    }

    if (this.cursors.up.isDown && this.body.velocity.y == 0 && !(this.body.blocked.up)) { // Skok
      this.body.setVelocityY(this.jumpSpeed);
    }

    if(this.body.velocity.y < -75){
      this.setTexture('upplayerArrows')
    }
    else if(this.body.velocity.y > 75){
      this.setTexture('downplayerArrows')
    }else{
      isY = false;
    }

    if(this.body.velocity.x < -75){
      this.setTexture('leftplayerArrows')
    }
    else if(this.body.velocity.x > 75){
      this.setTexture('rightplayerArrows')
    }else if(!isY){
      this.setTexture('playerArrows')
    }

  }

  alternativeWalk() {
    let isY = true;
    if (this.keys.A.isDown) { // Ruch w lewo
      this.body.setAccelerationX(-this.acceleration);
    } else if (this.keys.D.isDown) { // Ruch w prawo
      this.body.setAccelerationX(this.acceleration);
    } else {
      this.body.setAccelerationX(0);
    }

    if (this.keys.W.isDown && this.body.velocity.y == 0  && !(this.body.blocked.up)) { // Skok
      this.body.setVelocityY(this.jumpSpeed);
    }

    if(this.body.velocity.y < -75){
      this.setTexture('upplayerWASD')
    }
    else if(this.body.velocity.y > 75){
      this.setTexture('downplayerWASD')
    }else{
      isY = false;
    }
    
    if(this.body.velocity.x < -75){
      this.setTexture('leftplayerWASD')
    }
    else if(this.body.velocity.x > 75){
      this.setTexture('rightplayerWASD')
    }else if(!isY){
      this.setTexture('playerWASD')
    }
  }

  static getBall(player1, player2) {
    let canGet = true
    if (player1.ball == null && player2.ball == null) return
    if(canGet){
      if (player1.ball == null ) { //Player 1 ma piłkę, Player 2 ni ma piłki
        const temp = player1
        player1 = player2
        player2 = temp
      }
      
      player2.ball = player1.ball
      player2.ball.owner = player2
      player1.ball = null
      canGet = false
      setTimeout(()=>{canGet = true}, 1000)
    }
    

    

    // swap the ball based on keys
    // console.log(player1.ball == null)
  }
}

export default Player;
