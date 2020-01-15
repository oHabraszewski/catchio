//Plik zawierający klasę sceny Game - naszej głównej sceny gry
import Phaser from 'phaser';
import Ball from './Ball'; // pozniej sprawdze
import Player from './Player';
import { Canvas, Scale } from "./config/Screen";

let canShotL = true,
    canShotR = true;

const config = {//Potem przesyłany przez serwer
  startPosition: {
    x:160,
    y:500
  },
  ballY: 400
}
class Game extends Phaser.Scene {
  constructor(setup) {
    super(setup);
    this.ents = {}
    this.stop = this.stop.bind(this) //Kto pamięta Reacta?
    this.start = this.start.bind(this)
  }

  preload() {
    this.load.tilemapCSV("map", "/assets/img/map/map.csv");
    this.load.image("tiles", "/assets/img/map/tiles.png");

    this.load.image('ball', "/assets/img/bol.png");

    this.load.image('playerWASD', "/assets/img/red/PinkyWinky.png");
    this.load.image('playerArrows', "/assets/img/blue/BlueBlue.png");
  }
  start(){
    this.ents.playerWASD.setPosition(config.startPosition.x * Scale, config.startPosition.y * Scale)
    this.ents.playerWASD.ball = null

    this.ents.playerArrows.setPosition(Canvas.width - config.startPosition.x * Scale, config.startPosition.y * Scale)
    this.ents.playerArrows.ball = null

    this.ents.ball.setPosition(Canvas.width / 2, config.ballY * Scale)
    this.ents.ball.owner = null
    setTimeout(()=>{this.scene.resume()}, 3000)
  }
  stop(){
    this.scene.pause()
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
    layer.setTileIndexCallback(5, (object, obj)=>{
      if(canShotL && object == this.ents.ball){
        canShotL = false;
        setTimeout(()=>{
          this.stop()
          this.start()
        },500)
        setTimeout(()=>{canShotL = true},5000)
      }
    })
    layer.setTileIndexCallback(2, (object, obj)=>{
      if(canShotR && object == this.ents.ball){
        canShotR = false;
        setTimeout(()=>{
          this.stop()
          this.start()
        },500)
        setTimeout(()=>{canShotR = true},5000)
      }
    })

    this.ents.ball = new Ball(this, Canvas.width / 2, config.ballY * Scale, 'ball');
    this.ents.ball.setScale(Scale*1.5)
    const setOwn = Ball.setOwner.bind(this)

    this.ents.playerWASD = new Player(this, config.startPosition.x * Scale, config.startPosition.y * Scale, 'playerWASD');
    this.ents.playerWASD.setScale(Scale)

    this.ents.playerArrows = new Player(this, Canvas.width - config.startPosition.x * Scale, config.startPosition.y * Scale, 'playerArrows');
    this.ents.playerArrows.setScale(Scale)
    

    this.physics.add.collider(this.ents.playerWASD, layer);
    this.physics.add.collider(this.ents.playerArrows, layer);
    this.physics.add.collider(this.ents.ball, layer);

    this.ents.startOverlap = this.physics.add.overlap(this.ents.ball, this.ents.playerWASD, setOwn);
    this.ents.startOverlap2 = this.physics.add.overlap(this.ents.ball, this.ents.playerArrows, setOwn);
  }

  update() {
    this.ents.ball.moveToPlayer(this);

    this.ents.playerArrows.walk();
    this.ents.playerWASD.alternativeWalk();
  }
  resize(){
    console.log("Zmieniono  wielkość")
  }
}

export default Game;
