//Plik zawierający klasę piłki - obiektu który będziemy kraść i rzucać do bramek
'use strict';
import Phaser from 'phaser';

class Ball extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene,x, y, texture);
        // ...
        scene.add.existing(this);
    }
    
}
export default Ball;
