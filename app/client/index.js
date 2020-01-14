'use strict';
import styles from "./scss/index.scss" //Getting styles in scss
import Phaser from 'phaser';
import config from "./js/config/Phaser.js";
import Game from "./js/Game.js";

const game = new Phaser.Game(config);
console.log(`Only in development`)
