//Plik zawierający klasę sceny Game - naszej głównej sceny gry
import Phaser from 'phaser';
import Ball from './Ball.js'; // pozniej sprawdze
import Player from './Player.js';
let ball;
let player1;
let player2;
let cursors;
let overlapCollider;
let overlapCollider2;
let overlapTriggered = false;
class Game extends Phaser.Scene {
    constructor (setup) {
        super(setup);
    }
    preload(){
          this.load.image('ball', "../../assets/img/ball.png");
          this.load.image('player0', "../../assets/img/player0.png");
          this.load.image('player1', "../../assets/img/player1.png");
    }

    create(){
      ball = new Ball(this, 400, 300,'ball');
      player1 = new Player(this, 1000, 500, 'player0');
      player2 = new Player(this, 300, 500, 'player1');
      overlapCollider = this.physics.add.overlap(ball, player1, ball.getOwner);
      overlapCollider2 = this.physics.add.overlap(ball, player2, ball.getOwner);

    }

    update(){
      player1.walk();
      player2.alternativeWalk();
      ball.moveToPlayer(ball.owner);
    }
  }
export default Game;
