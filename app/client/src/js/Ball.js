//Plik zawierający klasę piłki - obiektu który będziemy kraść i rzucać do bramek
import Phaser from 'phaser';

class Ball extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    this.owner = null;
    
    scene.add.existing(this);
    scene.physics.world.enable(this);

    this.body.setDragX(300);
    this.body.setCollideWorldBounds(true);    
  }

  moveToPlayer() {
    if (this.owner != null) {
      // złe rozwiązanie fizyka wariuje, trzeba znaleźć coś w stylu this.moveTo(x,y)
      this.x = this.owner.x;
      this.y = this.owner.y;
    }
  }
  removeOwner() {
    this.owner = null;
  }

  static setOwner(ball, player) {
    if(ball.owner == null) {
      ball.owner = player;
    }
  }
}
export default Ball;
