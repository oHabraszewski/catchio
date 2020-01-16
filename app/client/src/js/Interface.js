import { Canvas, Scale } from "./config/Screen";

//Plik zawierający klasę zarządzającą wszystkimi elementami interfejsu - Punktami, przyciskami itp.
class Interface {
    constructor(scene){
        const size = 64;
        this.texts = {
            points1: scene.add.text(Canvas.width/2 - 75, 42, '0', {fontFamily: 'Comfortaa', fontSize: size + 'px', stroke: "#111", strokeThickness: size/5}).setOrigin(0.5, 0.5),
            points2: scene.add.text(Canvas.width/2 + 75, 42, '0', {fontFamily: 'Comfortaa', fontSize: size + 'px', stroke: "#111", strokeThickness: size/5}).setOrigin(0.5, 0.5),
            timer: scene.add.text(Canvas.width/2, Canvas.height/2, "", {fontFamily: 'Comfortaa', fontSize: (size * 5) +'px', stroke: "#111", strokeThickness: size*4/5}).setOrigin(0.5, 0.5)
        }
    }
    updatePoints(p1Points, p2Points){
        this.texts.points1.setText(p1Points)
        this.texts.points2.setText(p2Points)
    }
    createTimer(){
        this.texts.timer.setText('3')// Słabo mi się robi jak na to patrzę...
        setTimeout(()=>{
            this.texts.timer.setText('2');
            setTimeout(()=>{
                this.texts.timer.setText('1');
                setTimeout(()=>{
                    this.texts.timer.setText('GO!');
                    setTimeout(()=>{
                        this.texts.timer.setText('');
                    },750)
                },1000)
            },1000)}
        ,1000)
    }
}
export default Interface