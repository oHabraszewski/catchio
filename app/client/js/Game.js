//Plik zawierający klasę sceny Game - naszej głównej sceny gry
import Phaser from 'phaser';
//import Ball from './Ball.js'; - pozniej sprawdze

class Game extends Phaser.Scene {
    constructor (setup) {
        super(setup);
    }

    preload(){
          this.load.image('ball', "../../assets/img/ball.png");
    }

    create(){
      this.add.image(400, 300, 'ball'); // test czy działa import obrazka
    }

    update(){

    }
  }
export default Game;
