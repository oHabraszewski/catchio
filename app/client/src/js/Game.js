//Plik zawierający klasę sceny Game - naszej głównej sceny gry
import Phaser from 'phaser';
import Ball from './Ball'; // pozniej sprawdze
import Player from './Player';
import { Canvas, Scale, calcScale } from "./config/Screen";
import Interface from './Interface'

let canShotL = true,
    canShotR = true;

const config = {//Potem przesyłany przez serwer
  startPosition: {
    x:200,
    y:500
  },
  ballY: 400
}
class Game extends Phaser.Scene {
  constructor(setup) {
    super(setup);
    this.ents = {}
    this.points = [0,0]
    this.stop = this.stop.bind(this) //Kto pamięta Reacta?
    this.start = this.start.bind(this)
    this.canvas = null;
  }

  preload() {
    this.load.tilemapCSV("map", "/assets/img/map/map.csv");
    this.load.image("tiles", "/assets/img/map/tiles.png");

    this.load.image('ball', "/assets/img/bol.png");

    this.load.image('playerWASD', "/assets/img/red/PinkyWinky.png");         //Wkrótce przerobię na atlas
    this.load.image('upplayerWASD', "/assets/img/red/upPinkyWinky.png");
    this.load.image('leftplayerWASD', "/assets/img/red/leftPinkyWinky.png");
    this.load.image('downplayerWASD', "/assets/img/red/downPinkyWinky.png");
    this.load.image('rightplayerWASD', "/assets/img/red/rightPinkyWinky.png");

    this.load.image('playerArrows', "/assets/img/blue/BlueBlue.png");
    this.load.image('upplayerArrows', "/assets/img/blue/upBlueBlue.png");
    this.load.image('leftplayerArrows', "/assets/img/blue/leftBlueBlue.png");
    this.load.image('downplayerArrows', "/assets/img/blue/downBlueBlue.png");
    this.load.image('rightplayerArrows', "/assets/img/blue/rightBlueBlue.png");
  }
  start(){
    this.ents.playerWASD.setPosition(config.startPosition.x, config.startPosition.y)
    this.ents.playerWASD.body.setVelocity(0,0)
    this.ents.playerWASD.keys.W.isDown = false
    this.ents.playerWASD.keys.A.isDown = false
    this.ents.playerWASD.keys.S.isDown = false
    this.ents.playerWASD.keys.D.isDown = false
    this.ents.playerWASD.ball = null

    this.ents.playerArrows.setPosition(Canvas.width - config.startPosition.x, config.startPosition.y)
    this.ents.playerArrows.body.setVelocity(0,0)
    this.ents.playerArrows.cursors.up.isDown = false //AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
    this.ents.playerArrows.cursors.left.isDown = false
    this.ents.playerArrows.cursors.down.isDown = false
    this.ents.playerArrows.cursors.right.isDown = false
    this.ents.playerArrows.ball = null
    console.log(this.ents.playerArrows)

    this.ents.ball.setPosition(Canvas.width / 2, config.ballY)
    this.ents.ball.body.setVelocity(0,0)
    this.ents.ball.owner = null

    this.ents.interface.createTimer()
    setTimeout(()=>{this.scene.resume()}, 3000)
  }
  stop(){
    this.scene.pause()
  }
  create() {
    //Konfiguracja canvasa
    this.canvas = document.getElementsByTagName('canvas')[0]
    this.canvas.setAttribute("width", 1920)
    this.canvas.setAttribute("height", 1080)
    //Konfiguracja mapy z tileów
    const map = this.make.tilemap({ key: "map", tileWidth: 40, tileHeight: 40 });
    const tileset = map.addTilesetImage("tiles");
    const layer = map.createStaticLayer(0, tileset,0,0);
    layer.setCollision([3,0])//, true, false)
    layer.setTileIndexCallback(5, (object, obj)=>{
      if(canShotL && object == this.ents.ball){
        canShotL = false;
        this.points[1]++
        this.ents.interface.updatePoints(this.points[0], this.points[1])
        setTimeout(()=>{
          this.stop()
        },200)
        setTimeout(()=>{
          this.start()
        },1200)
        setTimeout(()=>{canShotL = true},5000)
      }
    })
    layer.setTileIndexCallback(2, (object, obj)=>{
      if(canShotR && object == this.ents.ball){
        canShotR = false;
        this.points[0]++
        this.ents.interface.updatePoints(this.points[0], this.points[1])
        setTimeout(()=>{
          this.stop()
        },200)
        setTimeout(()=>{
          this.start()
        },1200)
        setTimeout(()=>{canShotR = true},5000)
      }
    })

    this.ents.ball = new Ball(this, Canvas.width / 2, config.ballY, 'ball');
    this.ents.ball.setScale(1.5)
    const setOwn = Ball.setOwner.bind(this)

    this.ents.playerWASD = new Player(this, config.startPosition.x, config.startPosition.y, 'playerWASD');
    

    this.ents.playerArrows = new Player(this, Canvas.width - config.startPosition.x, config.startPosition.y, 'playerArrows');

    this.physics.add.collider(this.ents.playerWASD, layer);
    this.physics.add.collider(this.ents.playerArrows, layer);
    this.physics.add.collider(this.ents.ball, layer);

    this.ents.startOverlap = this.physics.add.overlap(this.ents.ball, this.ents.playerWASD, setOwn);
    this.ents.startOverlap2 = this.physics.add.overlap(this.ents.ball, this.ents.playerArrows, setOwn);

    this.ents.interface = new Interface(this)
    setTimeout(()=>{this.ents.interface.updatePoints(0,0)}, 1000)//Musi być dla dobrej czcionki
    this.time.advancedTiming = true
  }

  update() {
    this.ents.ball.moveToPlayer(this);
    this.ents.playerArrows.walk();
    this.ents.playerWASD.alternativeWalk();
  }
}

export default Game;
