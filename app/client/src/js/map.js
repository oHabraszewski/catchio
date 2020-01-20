let canShotL = true
let canShotR = true

let shotRTimeout = null
let shotLTimeout = null

export default function (mapId) {
    // Konfiguracja mapy z tileów
    const map = this.make.tilemap({ key: `map${mapId}`, tileWidth: 40, tileHeight: 40 });
    const tileset = map.addTilesetImage("tiles");
    this.ents.layer = map.createStaticLayer(0, tileset, 0, 0);
    this.ents.layer.setCollision([3, 0])

    this.ents.layer.setTileIndexCallback(5, (object, obj) => {
        if (canShotL && object == this.ents.ball && this.player.pointsIndex == 1) {
            canShotL = false;
            this.points[1]++
            this.ents.interface.updatePoints(this.points[0], this.points[1])
            shotLTimeout = setTimeout(() => {
                this.stop()
                this.socket.emit('restart')
            }, 500)
            setTimeout(() => { canShotL = true }, 5000)
        }
    })

    this.ents.layer.setTileIndexCallback(2, (object, obj) => {
        if (canShotR && object == this.ents.ball && this.player.pointsIndex == 0) {
            canShotR = false;
            this.points[0]++
            this.ents.interface.updatePoints(this.points[0], this.points[1])
            shotRTimeout = setTimeout(() => {
                this.stop()
                this.socket.emit('restart')
            }, 500)
            setTimeout(() => { canShotR = true }, 5000)
        }
    })


    return { shotLTimeout, shotRTimeout }
}