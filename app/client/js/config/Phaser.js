//Plik zawierający konfigurację Phasera
'use strict';
import Screen from "Screen.js";
//Importuje obiekt Screen z pliku Screen.js, w obiekcie tym znajduje się zmienna width i height

const config = {
    type: Phaser.AUTO,
    width: Screen.width, //Szerokość gry przyjmuje rozmiar okienka
    height: Screen.height, //Wysokość gry przyjmuje wysokość okienka
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
export default config;
