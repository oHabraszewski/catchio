//Plik zawierający klasę sceny Game - naszej głównej sceny gry
import Phaser from 'phaser';
import Ball from './Ball.js'; // pozniej sprawdze
let ball;
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
      ball = new Ball(this, 400,300,'ball');
    }

    update(){

    }
  }
export default Game;
