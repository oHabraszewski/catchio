//Plik zawierający konfigurację Phasera
'use strict';
import Screen from "./Screen.js";
//Importuje obiekt Screen z pliku Screen.js, w obiekcie tym znajduje się zmienna width i height
import Game from "./../Game.js";
//Importuje obiekt Game z pliku Game.js (który znajduje się 2 foldery przed aktualnym)
import Phaser from 'phaser';

const config = {
    type: Phaser.AUTO,
    width: Screen.width, //Szerokość gry przyjmuje rozmiar okienka
    height: Screen.height, //Wysokość gry przyjmuje wysokość okienka
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: Screen.height*1.5 }, //Dzieki temu na kazdym rozmiarze monitora gracz bedzie spadal tyle samo czasu
            debug: false
        }
    },
    scene: Game
};
export default config;
