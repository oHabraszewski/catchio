//Plik zawierający konfigurację Phasera
'use strict';
import {Screen, Scale} from "./Screen.js";
//Importuje obiekt Screen z pliku Screen.js, w obiekcie tym znajduje się zmienna width i height
import Game from "./../Game.js";
//Importuje obiekt Game z pliku Game.js (który znajduje się 2 foldery przed aktualnym)
import Phaser from 'phaser';

const config = {
    type: Phaser.AUTO,
    width: 1920 * Scale, //Szerokość gry przyjmuje rozmiar okienka
    height: 1080 * Scale, //Wysokość gry przyjmuje wysokość okienka
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: Screen.height*2 }, //Dzieki temu na kazdym rozmiarze monitora gracz bedzie spadal tyle samo czasu
            debug: false
        }
    },
    scene: Game
};
export default config;
