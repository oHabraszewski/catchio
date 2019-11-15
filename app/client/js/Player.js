//Plik zawierający ogólną klasę gracza
class Player extends Phaser.GameObjects.Sprite() {
    constructor (scene, x, y, texture) {
        super(scene, x, y, texture);

        scene.add.existing(this);
    }
}
