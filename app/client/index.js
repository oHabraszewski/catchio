require('./src/scss/index.scss') // Getting styles in scss

import Phaser from 'phaser';
import config from "./src/js/config/Phaser";

new Phaser.Game(config);