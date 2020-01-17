import { Canvas } from "./config/Screen";
import wait from './utils/wait'

//Plik zawierający klasę zarządzającą wszystkimi elementami interfejsu - Punktami, przyciskami itp.
class Interface {
    constructor(scene) {
        const size = 64;
        this.texts = {
            points1: scene.add.text(Canvas.width / 2 - 75, 42, '0', { fontFamily: 'Comfortaa', fontSize: size + 'px', stroke: "#111", strokeThickness: size / 5 }).setOrigin(0.5, 0.5),
            points2: scene.add.text(Canvas.width / 2 + 75, 42, '0', { fontFamily: 'Comfortaa', fontSize: size + 'px', stroke: "#111", strokeThickness: size / 5 }).setOrigin(0.5, 0.5),
            timer: scene.add.text(Canvas.width / 2, Canvas.height / 2, "", { fontFamily: 'Comfortaa', fontSize: (size * 5) + 'px', stroke: "#111", strokeThickness: size * 4 / 5 }).setOrigin(0.5, 0.5)
        }
    }

    setDepth(value) {
        this.texts.points1.setDepth(value)
        this.texts.points2.setDepth(value)
        this.texts.timer.setDepth(value)
    }
    
    updatePoints(p1Points, p2Points) {
        this.texts.points1.setText(p1Points)
        this.texts.points2.setText(p2Points)
    }
    async createTimer() {
        this.texts.timer.setText('3')
        await wait(1000)
        this.texts.timer.setText('2');
        await wait(1000)
        this.texts.timer.setText('1');
        await wait(1000)
        this.texts.timer.setText('GO');
        clear.call(this)
        
        async function clear() {
            await wait(750)
            this.texts.timer.setText('');
        }
    }
}
export default Interface