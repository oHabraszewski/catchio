//Plik zawierający klasę sceny Game - naszej głównej sceny gry
import Phaser from 'phaser';
import Ball from './Ball.js'; // pozniej sprawdze
import Player from './Player.js';
import {Screen, Scale} from "./config/Screen.js";
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
          this.load.image("tiles", "../../assets/img/tiles.png");
          this.load.tilemapCSV("map", "../../assets/img/map.csv")
          //this.load.image("mapIMG", "../../assets/img/tiles.png")
          //this.load.tilemapTiledJSON("map", "../../assets/img/map1.json");
          this.load.image('ball', "../../assets/img/ball.png");
          this.load.image('player0', "../../assets/img/player0.png");
          this.load.image('player1', "../../assets/img/player1.png");
    }

    create(){
      //Konfiguracja canvasa
      const canvas = document.getElementsByTagName('canvas')[0]
      canvas.setAttribute("width", 1920 * Scale)
      canvas.setAttribute("height", 1080 * Scale)
      //Konfiguracja mapy z tileów
      const map = this.make.tilemap({ key: "map", tileWidth: 40, tileHeight: 40 });
      const tileset = map.addTilesetImage("tiles");
      const layer = map.createStaticLayer(0, tileset,0,0);
      layer.setScale(Scale, Scale)
      layer.setCollision([3,0])

      ball = new Ball(this, 400, 300,'ball');
      player1 = new Player(this, 1000, 500, 'player0');
      player2 = new Player(this, 300, 500, 'player1');
      ball.startFollow(player1)
      
      overlapCollider = this.physics.add.overlap(ball, player1, ball.getOwner);
      overlapCollider2 = this.physics.add.overlap(ball, player2, ball.getOwner);

      this.physics.add.collider(player1, layer);
      this.physics.add.collider(player2, layer);
      this.physics.add.collider(ball, layer);
    }

    update(){
      player1.walk();
      player2.alternativeWalk();
      ball.moveToPlayer();
    }
  }
export default Game;
