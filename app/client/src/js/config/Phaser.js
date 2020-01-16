//Plik zawierający konfigurację Phasera
'use strict';
import {Canvas, Scale} from "./Screen.js";
//Importuje obiekt Canvas z pliku Screen.js, w obiekcie tym znajduje się zmienna width i height
import Game from "../Game";
//Importuje obiekt Game z pliku Game.js (który znajduje się 2 foldery przed aktualnym)
import Phaser from 'phaser';

const config = {
    type: Phaser.AUTO,
    width: 1920, //Szerokość gry przyjmuje rozmiar okienka
    height: 1080, //Wysokość gry przyjmuje wysokość okienka
    scale: {
        mode: Phaser.Scale.FIT,
        width: 1920,
        height: 1080,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: Canvas.height * 1.8 }, // Dzieki temu na kazdym rozmiarze monitora gracz bedzie spadal tyle samo czasu
            debug: false
        }
    },
    scene: Game
};
export default config;
