//Plik zawierający klasę sceny Game - naszej głównej sceny gry
import Phaser from 'phaser';
import Ball from './Ball'; // pozniej sprawdze
import Player from './Player';

import { Canvas } from "./config/Screen";
import connection from './socketIo/connection'
import Interface from './Interface'
import map from './map'

import defaultConfig from './config/default'
import { updatePos } from './socketIo/update'


let shotRTimeoutGlobal = null
let shotLTimeoutGlobal = null

class Game extends Phaser.Scene {
  constructor(setup) {
    super(setup);
    this.ents = {}
    this.updatePosSocket = updatePos.bind(this)
    this.gameplay = true
    this.points = [0, 0]
    this.canvas = null;
  }

  preload() {
    this.load.image("loading", "/assets/img/background.png")
    this.load.tilemapCSV("map1", "/assets/img/map/map1.csv");
    this.load.tilemapCSV("map2", "/assets/img/map/map2.csv");
    this.load.tilemapCSV("map3", "/assets/img/map/map3.csv");
    this.load.image("tiles", "/assets/img/map/tiles.png");

    this.load.audio("ping", "/assets/audio/point.wav");
    this.load.audio("bum", "/assets/audio/go.mp3");

    this.load.image('ball', "/assets/img/Bol.png");

    this.load.atlas("PinkyWinky", '/assets/img/red/atlasPinkyWinky.png', '/assets/img/red/atlasPinkyWinky.json')

    this.load.atlas("BlueBlue", '/assets/img/blue/atlasBlueBlue.png', '/assets/img/blue/atlasBlueBlue.json')
  }

  resetToDefault() {
    this.ents.interface.createWaiting()

    this.points[0] = 0
    this.points[1] = 0
    this.ents.interface.updatePoints('', '')

    this.ents.player1.setPosition(defaultConfig.playerPos.x, defaultConfig.playerPos.y)
    this.ents.player2.setPosition(Canvas.width - defaultConfig.playerPos.x, defaultConfig.playerPos.y)
    this.ents.ball.setPosition(Canvas.width / 2, defaultConfig.ballY)
  }

  resetPlayer(key) {
    const playerId = `player${key}`
    this.ents[playerId].keys.W.isDown = false;
    this.ents[playerId].keys.S.isDown = false;
    this.ents[playerId].keys.A.isDown = false;
    this.ents[playerId].keys.D.isDown = false;
    this.ents[playerId].cursors.up.isDown = false;
    this.ents[playerId].cursors.down.isDown = false;
    this.ents[playerId].cursors.left.isDown = false;
    this.ents[playerId].cursors.right.isDown = false;
    this.ents[playerId].defaultSpriteId = ''
    this.ents[playerId].body.setVelocity(0, 0)
    this.ents[playerId].ball = null
  }

  resetForGamplay(gameConfig) {
    this.ents.interface.updatePoints(this.points[0], this.points[1])

    const startPosition = gameConfig.map.startPosition

    this.ents.player1.setPosition(startPosition.x, startPosition.y)
    this.resetPlayer('1')

    this.ents.player2.setPosition(Canvas.width - startPosition.x, startPosition.y)
    this.resetPlayer('2')

    this.ents.ball.setPosition(Canvas.width / 2, startPosition.ballY)
    this.ents.ball.body.setVelocity(0, 0)
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
        this.ents.startOverlap = this.physics.add.overlap(this.ents.ball, this.player, this.setOwn);

      } else {
        this.otherPlayer = this.ents[gameConfig.sprites[socketId]]
        this.otherPlayer.defaultSpriteId = gameConfig.sprites[socketId]

        if (this.otherPlayer.defaultSpriteId.includes('1')) {
          this.otherPlayer.pointsIndex = 0
        } else {
          this.otherPlayer.pointsIndex = 1
        }
      }
    }

    const { shotLTimeout, shotRTimeout } = map.call(this, gameConfig.map.id)
    shotLTimeoutGlobal = shotLTimeout
    shotRTimeoutGlobal = shotRTimeout

    this.ents.player1.setDepth(1)
    this.ents.player2.setDepth(1)
    this.ents.ball.setDepth(1)
    this.ents.interface.setDepth(1)

    this.ents.colls.p1l.destroy()
    this.ents.colls.p2l.destroy()
    this.ents.colls.bl.destroy()

    this.ents.colls.p1l = this.physics.add.collider(this.ents.player1, this.ents.layer);
    this.ents.colls.p2l = this.physics.add.collider(this.ents.player2, this.ents.layer);
    this.ents.colls.bl = this.physics.add.collider(this.ents.ball, this.ents.layer);
  }

  start(gameConfig) {
    this.gameplay = true
    if (shotLTimeoutGlobal != null) clearTimeout(shotLTimeoutGlobal)
    if (shotRTimeoutGlobal != null) clearTimeout(shotRTimeoutGlobal)
    this.resetForGamplay(gameConfig)
    this.ents.interface.createTimer().then(() => {
      if (this.gameplay) this.scene.resume()
    })
  }

  stop(hard = true) {
    if (this.gameplay) {
      this.gameplay = false
      this.scene.pause()
      if (hard) this.resetToDefault()
    }
  }

  create() {
    //Konfiguracja canvasa
    this.canvas = document.getElementsByTagName('canvas')[0]
    this.canvas.setAttribute("width", 1920)
    this.canvas.setAttribute("height", 1080)

    // ------------------------------------------------------------------------

    this.loadingImg = this.add.image(960, 540, "loading")

    // ------------------------------------------------------------------------

    this.ents.ball = new Ball(this, Canvas.width / 2, defaultConfig.ballY, 'ball');
    this.ents.ball.setScale(1.3)
    this.setOwn = Ball.setOwner.bind(this)

    this.ents.player1 = new Player(this, defaultConfig.playerPos.x, defaultConfig.playerPos.y, 'PinkyWinky');

    this.ents.player2 = new Player(this, Canvas.width - defaultConfig.playerPos.x, defaultConfig.playerPos.y, 'BlueBlue');

    this.physics.world.TILE_BIAS = 64;

    this.ents.colls = {}
    this.ents.colls.p1l = this.physics.add.collider(this.ents.player1, this.ents.layer);
    this.ents.colls.p2l = this.physics.add.collider(this.ents.player2, this.ents.layer);
    this.ents.colls.bl = this.physics.add.collider(this.ents.ball, this.ents.layer);

    this.ents.interface = new Interface(this)
    this.ents.interface.updatePoints('0', '0')
    this.time.advancedTiming = true

    this.stop()


    this.socket = io(/* dev:start */ 'localhost:8000' /* dev:end */)
    connection.connect.call(this)
  }

  update() {
    this.ents.ball.moveToPlayer(this);
    this.player.walk()
    this.updatePosSocket()
    Player.updateTexture(this.player)
    Player.updateTexture(this.otherPlayer)
  }

}

export default Game;
