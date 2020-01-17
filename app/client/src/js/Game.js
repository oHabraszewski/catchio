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
    this.updatePosSocket = updatePos.bind(this)
    this.points = [0, 0]
    this.canvas = null;
  }

  preload() {
    this.load.tilemapCSV("map1", "/assets/img/map/map1.csv");
    this.load.tilemapCSV("map2", "/assets/img/map/map2.csv");
    this.load.tilemapCSV("map3", "/assets/img/map/map3.csv");
    this.load.image("tiles", "/assets/img/map/tiles.png");

    this.load.image('ball', "/assets/img/Bol.png");

    this.load.atlas("PinkyWinky", '/assets/img/red/atlasPinkyWinky.png', '/assets/img/red/atlasPinkyWinky.json')

    this.load.atlas("BlueBlue", '/assets/img/blue/atlasBlueBlue.png', '/assets/img/blue/atlasBlueBlue.json')
    // this.load.image('player1', "/assets/img/red/PinkyWinky.png");         //Przerobiłem na atlas
    // this.load.image('upplayer1', "/assets/img/red/upPinkyWinky.png");
    // this.load.image('leftplayer1', "/assets/img/red/leftPinkyWinky.png");
    // this.load.image('downplayer1', "/assets/img/red/downPinkyWinky.png");
    // this.load.image('rightplayer1', "/assets/img/red/rightPinkyWinky.png");
    // this.load.image('leftupplayer1', "/assets/img/red/leftupPinkyWinky.png");
    // this.load.image('leftdownplayer1', "/assets/img/red/leftdownPinkyWinky.png");
    // this.load.image('rightupplayer1', "/assets/img/red/rightupPinkyWinky.png");
    // this.load.image('rightdownplayer1', "/assets/img/red/rightdownPinkyWinky.png");

    // this.load.image('player2', "/assets/img/blue/BlueBlue.png");
    // this.load.image('upplayer2', "/assets/img/blue/upBlueBlue.png");
    // this.load.image('leftplayer2', "/assets/img/blue/leftBlueBlue.png");
    // this.load.image('downplayer2', "/assets/img/blue/downBlueBlue.png");
    // this.load.image('rightplayer2', "/assets/img/blue/rightBlueBlue.png");
    // this.load.image('leftupplayer2', "/assets/img/blue/leftupBlueBlue.png");
    // this.load.image('leftdownplayer2', "/assets/img/blue/leftdownBlueBlue.png");
    // this.load.image('rightupplayer2', "/assets/img/blue/rightupBlueBlue.png");
    // this.load.image('rightdownplayer2', "/assets/img/blue/rightdownBlueBlue.png");
  }

  resetToDefault() {
    this.ents.player1.setPosition(defaultConfig.playerPos.x, defaultConfig.playerPos.y)
    this.ents.player2.setPosition(Canvas.width - defaultConfig.playerPos.x, defaultConfig.playerPos.y)
    this.ents.ball.setPosition(Canvas.width / 2, defaultConfig.ballY)
  }
  resetPlayer(key){
    const playerId = `player${key}`
    this.ents[playerId].keys.W.isDown = false;
    this.ents[playerId].keys.S.isDown = false;
    this.ents[playerId].keys.A.isDown = false;
    this.ents[playerId].keys.D.isDown = false;
    this.ents[playerId].cursors.up.isDown = false;
    this.ents[playerId].cursors.down.isDown = false;
    this.ents[playerId].cursors.left.isDown = false;
    this.ents[playerId].cursors.right.isDown = false;
    this.ents[playerId].body.setVelocity(0,0)
    this.ents[playerId].ball = null
  }

  resetForGamplay(gameConfig) {
    const startPosition = gameConfig.map.startPosition

    this.ents.player1.setPosition(startPosition.x, startPosition.y)
    this.resetPlayer('1')

    this.ents.player2.setPosition(Canvas.width - startPosition.x, startPosition.y)
    this.resetPlayer('2')

    this.ents.ball.setPosition(Canvas.width / 2, startPosition.ballY)
    this.ents.ball.body.setVelocity(0,0)
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


    // id mapy pod: gameConfig.map.id
    // mapy oraz startPosition dla mapy jest dostęna pod: app/server/src/socketIo/data.js
    //  set map
  }

  start(gameConfig) {
    if (shotLTimeout != null) clearTimeout(shotLTimeout)
    if (shotRTimeout != null) clearTimeout(shotRTimeout)
    this.resetForGamplay(gameConfig)
    this.ents.interface.createTimer().then(() => {
      this.scene.resume()
    })
  }

  stop() {
    this.scene.pause()
    this.resetToDefault()
  }

  create() {
    //Konfiguracja canvasa
    this.canvas = document.getElementsByTagName('canvas')[0]
    this.canvas.setAttribute("width", 1920)
    this.canvas.setAttribute("height", 1080)
    //Konfiguracja mapy z tileów
    const map = this.make.tilemap({ key: "map3", tileWidth: 40, tileHeight: 40 }); // nie wiemy na ten moment jaka będzie mapa
    const tileset = map.addTilesetImage("tiles");
    const layer = map.createStaticLayer(0, tileset, 0, 0);
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
    this.setOwn = Ball.setOwner.bind(this)

    this.ents.player1 = new Player(this, defaultConfig.playerPos.x, defaultConfig.playerPos.y, 'PinkyWinky');

    this.ents.player2 = new Player(this, Canvas.width - defaultConfig.playerPos.x, defaultConfig.playerPos.y, 'BlueBlue');

    this.physics.world.TILE_BIAS = 64;

    this.physics.add.collider(this.ents.player1, layer);
    this.physics.add.collider(this.ents.player2, layer);
    this.physics.add.collider(this.ents.ball, layer);

    this.stop()

    this.ents.interface = new Interface(this)
    setTimeout(() => { this.ents.interface.updatePoints(0, 0) }, 1000)//Musi być dla dobrej czcionki
    this.time.advancedTiming = true

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
