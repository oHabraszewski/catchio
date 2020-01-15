//Plik zawierający klasę sceny Game - naszej głównej sceny gry
import Phaser from 'phaser';
import Ball from './Ball'; // pozniej sprawdze
import Player from './Player';
import { Screen, Scale } from "./config/Screen";

class Game extends Phaser.Scene {
  constructor(setup) {
    super(setup);
    this.ents = {}
  }

  preload() {
    this.load.tilemapCSV("map", "/assets/img/map/map.csv");
    this.load.image("tiles", "/assets/img/map/tiles.png");

    this.load.image('ball', "/assets/img/ball.png");

    this.load.image('playerWASD', "/assets/img/red/player.png");
    this.load.image('playerArrows', "/assets/img/blue/player.png");

    //this.load.image("mapIMG", "/assets/img/map/tiles.png")
    //this.load.tilemapTiledJSON("map", "/assets/img/map/map1.json");
  }

  create() {
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

    this.ents.ball = new Ball(this, 400, 300, 'ball');
    this.ents.ball.setScale(Scale*1.5)
    const setOwn = Ball.setOwner.bind(this)

    this.ents.playerWASD = new Player(this, 1000, 500, 'playerWASD');
    this.ents.playerWASD.setScale(Scale)

    this.ents.playerArrows = new Player(this, 300, 500, 'playerArrows');
    this.ents.playerArrows.setScale(Scale)
    

    this.physics.add.collider(this.ents.playerWASD, layer);
    this.physics.add.collider(this.ents.playerArrows, layer);
    this.physics.add.collider(this.ents.ball, layer);

    this.ents.startOverlap = this.physics.add.overlap(this.ents.ball, this.ents.playerWASD, setOwn);
    this.ents.startOverlap2 = this.physics.add.overlap(this.ents.ball, this.ents.playerArrows, setOwn);

    //this.physics.add.overlap(this.ents.playerWASD, this.ents.playerArrows, Player.getBall);
  }

  update() {
    this.ents.ball.moveToPlayer(this);

    this.ents.playerArrows.walk();
    this.ents.playerWASD.alternativeWalk();
  }
}

export default Game;
