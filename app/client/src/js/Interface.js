import { Canvas } from "./config/Screen";
import wait from './utils/wait'

//Plik zawierający klasę zarządzającą wszystkimi elementami interfejsu - Punktami, przyciskami itp.

const waitMessage = 'Oczekiwanie na przeciwnika'

class Interface {
    constructor(scene) {
        const size = 64;
        this.scene = scene
        this.texts = {
            points1: scene.add.text(Canvas.width / 2 - 75, 42, '0', { fontFamily: 'Comfortaa', fontSize: size + 'px', stroke: "#111", strokeThickness: size / 5 }).setOrigin(0.5, 0.5),
            points2: scene.add.text(Canvas.width / 2 + 75, 42, '0', { fontFamily: 'Comfortaa', fontSize: size + 'px', stroke: "#111", strokeThickness: size / 5 }).setOrigin(0.5, 0.5),
            timer: scene.add.text(Canvas.width / 2, Canvas.height / 2, "", { fontFamily: 'Comfortaa', fontSize: (size * 5) + 'px', stroke: "#111", strokeThickness: size * 4 / 5 }).setOrigin(0.5, 0.5),
            waiting: scene.add.text(150, Canvas.height / 2, "", { fontFamily: 'Comfortaa', fontSize: (size * 2) + 'px', stroke: "#111", strokeThickness: size * 2 / 5 }).setOrigin(0, 0.5)
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
        try {
            this.texts.timer.setText('3');
            this.scene.sound.play("ping")
            await wait(1000)

            if (!this.scene.gameplay) throw 'STOP_TIMER'
            this.texts.timer.setText('2');
            this.scene.sound.play("ping")
            await wait(1000)

            if (!this.scene.gameplay) throw 'STOP_TIMER'
            this.texts.timer.setText('1');
            this.scene.sound.play("ping")
            await wait(1000)

            if (!this.scene.gameplay) throw 'STOP_TIMER'
            this.texts.timer.setText('GO');
            this.scene.sound.play("bum")
            clear.call(this)

        } catch (err) { }

        async function clear() {
            await wait(750)
            this.texts.timer.setText('');
        }
    }

    async createWaiting() {
        this.scene.loadingImg.setDepth(1)
        this.texts.waiting.setDepth(1)

        this.scene.loadingImg.visible = true
        this.texts.waiting.visible = true


        try {
            while (!this.scene.gameplay) {
                this.texts.waiting.setText(`${waitMessage}`);
                await wait(250)

                if (this.scene.gameplay) throw ''
                this.texts.waiting.setText(`${waitMessage}.`);
                await wait(250)

                if (this.scene.gameplay) throw ''
                this.texts.waiting.setText(`${waitMessage}..`);
                await wait(250)

                if (this.scene.gameplay) throw ''
                this.texts.waiting.setText(`${waitMessage}...`);

                await wait(250)
            }
        } catch (err) { }

        this.scene.loadingImg.visible = false
        this.texts.waiting.visible = false
    }
}
export default Interface