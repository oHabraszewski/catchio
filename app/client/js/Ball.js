//Plik zawierający klasę piłki - obiektu który będziemy kraść i rzucać do bramek
class Ball extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        // ...
        scene.add.existing(this);
    }
    
}
