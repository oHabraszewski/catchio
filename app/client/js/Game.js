//Plik zawierający klasę sceny Game - naszej głównej sceny gry
import Phaser from 'phaser';
import Ball from './Ball.js'; // pozniej sprawdze

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
      let ball = new Ball(this, 400,300,'ball');
      //let ball = this.physics.add.sprite(100, 450, 'ball');

      //this.add.image(400, 300, 'ball'); // test czy działa import obrazka
      this.physics.world.enable(ball);
      ball.setCollideWorldBounds(true);
    }

    update(){

    }
  }
export default Game;
