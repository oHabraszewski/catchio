//Plik zawierający klasę piłki - obiektu który będziemy kraść i rzucać do bramek
'use strict';
import Phaser from 'phaser';

class Ball extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene,x, y, texture);
        // ...

        scene.add.existing(this);
    }
    addphysics(scene, object){                //Uniwersalna funkcja do uruchomienia fizyki dla obiektu
      scene.physics.world.enable(this);
      this.body.setCollideWorldBounds(true);
    }
}
export default Ball;
