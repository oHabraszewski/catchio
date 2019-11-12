//Plik zawierający klasę sceny Game - naszej głównej sceny gry
import config from "config/Phaser.js"

const setup = {
    key: 'main',
    active: true,
    visible: true,
    pack: false,
    cameras: null,
    map: {},
    physics: config.physics,
    loader: {},
    plugins: false,
    input: {}
};

class Game extends Phaser.Scene {
    constructor (setup) {
        super(setup);
    }

    preload :function ()
    {

    },

    create: function ()
    {

    },

    update: function ()
    {

    }
  }
export default Game;
