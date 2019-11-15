//Plik zawierający klasę sceny Game - naszej głównej sceny gry
import Phaser from 'phaser';
//import Ball from './Ball.js'; - pozniej sprawdze

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
      this.add.image(400, 300, 'ball'); // test czy działa import obrazka
    }

    update(){

    }
  }
export default Game;
