//Plik zawierający klasę sceny Game - naszej głównej sceny gry
import Phaser from 'phaser';
import Ball from './Ball.js'; // pozniej sprawdze
let ball;
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
      ball.addphysics(this, ball); // funckja uruchamia fizyke dla obiektu, w nawiasie 1-sza wartosc to scena(tutaj Game)
                                  // a 2-ga to obiekt, na ktory dzialac ma fizyka. Mozna uzyc dla gracza.

    }

    update(){

    }
  }
export default Game;
