//Plik zawierający klasę sceny Game - naszej głównej sceny gry
import Phaser from 'phaser';
import Ball from './Ball'; // pozniej sprawdze
import Player from './Player';
import { Screen, Scale } from "./config/Screen";

let ball;
let player1;
let player2;

class Game extends Phaser.Scene {
  constructor(setup) {
    super(setup);
  }

  preload() {
    this.load.tilemapCSV("map", "/assets/img/map/map.csv")
    
    this.load.image("tiles", "/assets/img/map/tiles.png");
    this.load.image('ball', "/assets/img/ball.png");
    this.load.image('player1', "/assets/img/red/player.png");
    this.load.image('player2', "/assets/img/blue/player.png");

    //this.load.image("mapIMG", "/assets/img/map/tiles.png")
    //this.load.tilemapTiledJSON("map", "/assets/img/map/map1.json");
  }

  create() {
    const map = this.make.tilemap({ key: "map", tileWidth: 40, tileHeight: 40 });
    const tileset = map.addTilesetImage("tiles");

    const mapLayer = map.createStaticLayer(0, tileset, 0, 0);

    mapLayer.setScale(Scale, Scale)
    mapLayer.setCollision([3, 0])

    ball = new Ball(this, 400, 300, 'ball');
    player1 = new Player(this, 1000, 500, 'player1');
    player2 = new Player(this, 300, 500, 'player2');

    // coś u mnie nie działa (Wiktor)
    this.physics.add.collider(player1, mapLayer);
    this.physics.add.collider(player2, mapLayer);
    
    this.physics.add.collider(ball, mapLayer);

    this.physics.add.overlap(ball, player1, Ball.setOwner);
    this.physics.add.overlap(ball, player2, Ball.setOwner);

    this.physics.add.overlap(player1, player2, Player.getBall);
  }

  update() {
    ball.moveToPlayer();

    player1.walk();
    player2.alternativeWalk();
  }
}

export default Game;
