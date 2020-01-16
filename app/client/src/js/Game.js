//Plik zawierający klasę sceny Game - naszej głównej sceny gry
import Phaser from 'phaser';
import Ball from './Ball'; // pozniej sprawdze
import Player from './Player';

import { Canvas } from "./config/Screen";
import connection from './socketIo/connection'
import Interface from './Interface'

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
    this.gameplay = true
    this.updatePosSocket = updatePos.bind(this)
    this.points = [0, 0]
    this.canvas = null;
  }

  preload() {
    // this.load.tilemapCSV("map", "/assets/img/map/map.csv");
    // this.load.image("tiles", "/assets/img/map/tiles.png");

    // this.load.image('ball', "/assets/img/ball.png");

    // this.load.image('player1', "/assets/img/red/player.png");
    // this.load.image('player2', "/assets/img/blue/player.png");


    this.load.tilemapCSV("map", "/assets/img/map/map.csv");
    this.load.image("tiles", "/assets/img/map/tiles.png");

    this.load.image('ball', "/assets/img/bol.png");

    this.load.image('player1', "/assets/img/red/PinkyWinky.png");         //Wkrótce przerobię na atlas
    this.load.image('upplayer1', "/assets/img/red/upPinkyWinky.png");
    this.load.image('leftplayer1', "/assets/img/red/leftPinkyWinky.png");
    this.load.image('downplayer1', "/assets/img/red/downPinkyWinky.png");
    this.load.image('rightplayer1', "/assets/img/red/rightPinkyWinky.png");

    this.load.image('player2', "/assets/img/blue/BlueBlue.png");
    this.load.image('upplayer2', "/assets/img/blue/upBlueBlue.png");
    this.load.image('leftplayer2', "/assets/img/blue/leftBlueBlue.png");
    this.load.image('downplayer2', "/assets/img/blue/downBlueBlue.png");
    this.load.image('rightplayer2', "/assets/img/blue/rightBlueBlue.png");
  }

  resetToDefault() {
    this.ents.player1.setPosition(defaultConfig.playerPos.x, defaultConfig.playerPos.y)
    this.ents.player2.setPosition(Canvas.width - defaultConfig.playerPos.x, defaultConfig.playerPos.y)
    this.ents.ball.setPosition(Canvas.width / 2, defaultConfig.ballY)
  }

  resetForGamplay(gameConfig) {
    const startPosition = gameConfig.map.startPosition

    this.ents.player1.setPosition(startPosition.x, startPosition.y)
    this.ents.player1.body.velocity.x = 0;
    this.ents.player1.body.velocity.y = 0;
    this.ents.player1.ball = null

    this.ents.player2.setPosition(Canvas.width - startPosition.x, startPosition.y)
    this.ents.player2.body.velocity.x = 0;
    this.ents.player2.body.velocity.y = 0;
    this.ents.player2.ball = null

    this.ents.ball.setPosition(Canvas.width / 2, startPosition.ballY)
    this.ents.ball.body.velocity.x = 0;
    this.ents.ball.body.velocity.y = 0;
    this.ents.ball.owner = null

    const spritesKeys = Object.keys(gameConfig.sprites)
    for (let i = 0; i < spritesKeys.length; i++) {
      const socketId = spritesKeys[i];
      if (socketId == this.socket.id) {
        this.player = this.ents[gameConfig.sprites[socketId]]
        this.player.defaultSpriteId = gameConfig.sprites[socketId]

        if (this.player.defaultSpriteId.includes('1')) {
          this.player.pointsIndex = 0
        } else {
          this.player.pointsIndex = 1
        }

        this.player.setHuman(true)
      } else {
        this.otherPlayer = this.ents[gameConfig.sprites[socketId]]
        this.otherPlayer.defaultSpriteId = gameConfig.sprites[socketId]

        if (this.otherPlayer.defaultSpriteId.includes('1')) {
          this.otherPlayer.pointsIndex = 0
        } else {
          this.otherPlayer.pointsIndex = 1
        }

        this.otherPlayer.setHuman(false)
      }
    }
    //  set map
  }

  start(gameConfig) {
    if (shotLTimeout != null) clearTimeout(shotLTimeout)
    if (shotRTimeout != null) clearTimeout(shotRTimeout)
    this.resetForGamplay(gameConfig)
    this.ents.interface.createTimer().then(() => {
      this.scene.resume()
      this.gameplay = true
    })
  }

  stop() {
    if (this.gameplay) {
      this.gameplay = false
      this.scene.pause()
      this.resetToDefault()
    }
  }

  create() {
    //Konfiguracja canvasa
    this.canvas = document.getElementsByTagName('canvas')[0]
    this.canvas.setAttribute("width", 1920)
    this.canvas.setAttribute("height", 1080)
    //Konfiguracja mapy z tileów
    const map = this.make.tilemap({ key: "map", tileWidth: 40, tileHeight: 40 }); // nie wiemy na ten moment jaka będzie mapa
    const tileset = map.addTilesetImage("tiles");
    const layer = map.createStaticLayer(0, tileset, 0, 0);
    // layer.setScale(Scale, Scale)
    layer.setCollision([3, 0])

    layer.setTileIndexCallback(5, (object, obj) => {
      if (canShotL && object == this.ents.ball) {
        canShotL = false;
        this.points[1]++
        this.ents.interface.updatePoints(this.points[0], this.points[1])
        shotLTimeout = setTimeout(() => {
          this.stop()
          if (this.player.pointsIndex == 1) this.socket.emit('restart')
        }, 500)
        setTimeout(() => { canShotL = true }, 5000)
      }
    })

    layer.setTileIndexCallback(2, (object, obj) => {
      if (canShotR && object == this.ents.ball) {
        canShotR = false;
        this.points[0]++
        this.ents.interface.updatePoints(this.points[0], this.points[1])
        shotRTimeout = setTimeout(() => {
          this.stop()
          if (this.player.pointsIndex == 0) this.socket.emit('restart')
        }, 500)
        setTimeout(() => { canShotR = true }, 5000)
      }
    })

    this.ents.ball = new Ball(this, Canvas.width / 2, defaultConfig.ballY, 'ball');
    this.ents.ball.setScale(1.5)
    const setOwn = Ball.setOwner.bind(this)

    this.ents.player1 = new Player(this, defaultConfig.playerPos.x, defaultConfig.playerPos.y, 'player1');
    // this.ents.player1.setScale(Scale)

    this.ents.player2 = new Player(this, Canvas.width - defaultConfig.playerPos.x, defaultConfig.playerPos.y, 'player2');
    // this.ents.player2.setScale(Scale)

    this.physics.add.collider(this.ents.player1, layer);
    this.physics.add.collider(this.ents.player2, layer);
    this.physics.add.collider(this.ents.ball, layer);

    this.ents.startOverlap = this.physics.add.overlap(this.ents.ball, this.ents.player1, setOwn);
    this.ents.startOverlap2 = this.physics.add.overlap(this.ents.ball, this.ents.player2, setOwn);

    this.stop()

    this.ents.interface = new Interface(this)
    setTimeout(() => { this.ents.interface.updatePoints(0, 0) }, 1000)//Musi być dla dobrej czcionki
    this.time.advancedTiming = true


    this.socket = io(/* dev:start */ 'localhost:8000' /* dev:end */)
    connection.connect.call(this)
  }

  update() {
    if (this.gameplay) {
      this.ents.ball.moveToPlayer(this);
      this.player.walk()
      this.updatePosSocket()

      Player.updateTexture(this.player)
      Player.updateTexture(this.otherPlayer)
    }
    // this.ents.player2.walk();
    // this.ents.player1.alternativeWalk();
  }

}

export default Game;
