require('./src/scss/index.scss') // Getting styles in scss

import Phaser from 'phaser';
import config from "./src/js/config/Phaser";

const mainDiv = document.getElementById("main");
const gameDiv = document.getElementById("game");
const creditsDiv = document.getElementById("credits");
const mainBut = document.getElementById("toMainCredits");
const gameBut = document.getElementById("play");
const creditsBut = document.getElementById("crediting");

mainBut.onclick = () => { toMain() }
gameBut.onclick = () => { toGame() }
creditsBut.onclick = () => { toCredits() }

function toCredits() {
    mainDiv.style.visibility = 'hidden'
    gameDiv.style.visibility = 'hidden'
    creditsDiv.style.visibility = 'visible'
}
function toGame() {
    mainDiv.style.visibility = 'hidden'
    gameDiv.style.visibility = 'visible'
    creditsDiv.style.visibility = 'hidden'
    new Phaser.Game(config);
}
function toMain() {
    mainDiv.style.visibility = 'visible'
    gameDiv.style.visibility = 'hidden'
    creditsDiv.style.visibility = 'hidden'
}

toMain()