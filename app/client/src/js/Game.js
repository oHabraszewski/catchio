//Plik zawierający klasę sceny Game - naszej głównej sceny gry
import Phaser from 'phaser';
import Ball from './Ball'; // pozniej sprawdze
import Player from './Player';
import { Canvas, Scale } from "./config/Screen";
import connection from './socketIo/connection'

import defaultConfig from './config/default'
import { updatePos } from './socketIo/update'


let canShotL = true
let canShotR = true

let shotRTimeout = null
let shotLTimeout = null

class Game extends Phaser.Scene {
  constructor(setup) {
    super(setup);
    this.ents = {}
    this.gameplay = false
    this.updatePosSocket = updatePos.bind(this)
  }

  preload() {
    this.load.tilemapCSV("map", "/assets/img/map/map.csv");
    this.load.image("tiles", "/assets/img/map/tiles.png");

    this.load.image('ball', "/assets/img/ball.png");

    this.load.image('player1', "/assets/img/red/player.png");
    this.load.image('player2', "/assets/img/blue/player.png");
  }

  resetToDefault() {
    this.ents.player1.setPosition(defaultConfig.playerPos.x * Scale, defaultConfig.playerPos.y * Scale)
    this.ents.player2.setPosition(Canvas.width - defaultConfig.playerPos.x * Scale, defaultConfig.playerPos.y * Scale)
    this.ents.ball.setPosition(Canvas.width / 2, defaultConfig.ballY * Scale)
  }

  resetForGamplay(gameConfig) {
    const startPosition = gameConfig.map.startPosition

    this.ents.player1.setPosition(startPosition.x * Scale, startPosition.y * Scale)
    this.ents.player1.ball = null

    this.ents.player2.setPosition(Canvas.width - startPosition.x * Scale, startPosition.y * Scale)
    this.ents.player2.ball = null

    this.ents.ball.setPosition(Canvas.width / 2, startPosition.ballY * Scale)
    this.ents.ball.owner = null

    const spritesKeys = Object.keys(gameConfig.sprites)
    for (let i = 0; i < spritesKeys.length; i++) {
      const socketId = spritesKeys[i];
      if (socketId == this.socket.id) {
        this.player = this.ents[gameConfig.sprites[socketId]]
        this.player.setHuman(true)
      } else {
        this.otherPlayer = this.ents[gameConfig.sprites[socketId]]
        this.otherPlayer.setHuman(false)
      }
    }

    //  set map
  }

  start(gameConfig) {
    if (shotLTimeout != null) clearTimeout(shotLTimeout)
    if (shotRTimeout != null) clearTimeout(shotRTimeout)
    this.resetForGamplay(gameConfig)
    this.scene.resume()
    this.gameplay = true
  }

  stop() {
    this.gameplay = false
    this.scene.pause()
    this.resetToDefault()
  }

  create() {
    //Konfiguracja canvasa
    const canvas = document.getElementsByTagName('canvas')[0]
    canvas.setAttribute("width", 1920 * Scale)
    canvas.setAttribute("height", 1080 * Scale)
    //Konfiguracja mapy z tileów
    const map = this.make.tilemap({ key: "map", tileWidth: 40, tileHeight: 40 }); // nie wiemy na ten moment jaka będzie mapa
    const tileset = map.addTilesetImage("tiles");
    const layer = map.createStaticLayer(0, tileset, 0, 0);
    layer.setScale(Scale, Scale)
    layer.setCollision([3, 0])

    layer.setTileIndexCallback(5, (object, obj) => {
      if (canShotL && object == this.ents.ball) {
        canShotL = false;
        shotLTimeout = setTimeout(() => {
          this.stop()
          this.socket.emit('restart')
        }, 500)
        setTimeout(() => { canShotL = true }, 5000)
      }
    })

    layer.setTileIndexCallback(2, (object, obj) => {
      if (canShotR && object == this.ents.ball) {
        canShotR = false;
        shotRTimeout = setTimeout(() => {
          this.stop()
          this.socket.emit('restart')
        }, 500)
        setTimeout(() => { canShotR = true }, 5000)
      }
    })

    this.ents.ball = new Ball(this, Canvas.width / 2, defaultConfig.ballY * Scale, 'ball');
    this.ents.ball.setScale(Scale * 1.5)
    const setOwn = Ball.setOwner.bind(this)

    this.ents.player1 = new Player(this, defaultConfig.playerPos.x * Scale, defaultConfig.playerPos.y * Scale, 'player1');
    this.ents.player1.setScale(Scale)

    this.ents.player2 = new Player(this, Canvas.width - defaultConfig.playerPos.x * Scale, defaultConfig.playerPos.y * Scale, 'player2');
    this.ents.player2.setScale(Scale)

    this.physics.add.collider(this.ents.player1, layer);
    this.physics.add.collider(this.ents.player2, layer);
    this.physics.add.collider(this.ents.ball, layer);

    this.ents.startOverlap = this.physics.add.overlap(this.ents.ball, this.ents.player1, setOwn);
    this.ents.startOverlap2 = this.physics.add.overlap(this.ents.ball, this.ents.player2, setOwn);

    this.stop()


    this.socket = io(/* dev:start */ 'localhost:8000' /* dev:end */)
    connection.connect.call(this)

  }

  update() {
    if (this.gameplay) {
      this.ents.ball.moveToPlayer(this);
      this.player.walk()
      this.updatePosSocket()
    }
    // this.ents.player2.walk();
    // this.ents.player1.alternativeWalk();
  }

  resize() {
    console.log("Zmieniono  wielkość")
  }
}

export default Game;
