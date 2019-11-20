//Plik zawierający klasę sceny Game - naszej głównej sceny gry
import Phaser from 'phaser';
import Ball from './Ball.js'; // pozniej sprawdze
import Player from './Player.js';
let ball;
let player1;
let player2;
let cursors;
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
      cursors = this.input.keyboard.createCursorKeys();
    }

    update(){
      player1.walk(cursors);
    }
  }
export default Game;
