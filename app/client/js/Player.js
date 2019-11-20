//Plik zawierający ogólną klasę gracza
'use strict';
import Phaser from 'phaser';

class Player extends Phaser.GameObjects.Sprite {
    constructor (scene, x, y, texture) {
        super(scene, x, y, texture);

        scene.add.existing(this);
    }
}
export default Player;
