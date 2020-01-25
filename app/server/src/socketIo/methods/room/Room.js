class Room {
    constructor(id) {
        this.id = id
        this.players = {}
        this.playersCount = 0

        this.gameplay = false
        this.events = {}
    }

    emitForEachPlayer(event, configs, forEeachPlayer) {
        for (const playerIn in this.players) {
            const player = this.players[playerIn]

            player.socket.emit(event, {
                ...configs,
                yours: forEeachPlayer[playerIn]
            })
        }
    }

    emit() {
        for (const playerIn in this.players) {
            const player = this.players[playerIn]
            player.socket.emit(...arguments)
        }
    }

    everyOther(notPlayerId) {
        const args = [...arguments]
        args.splice(0, 1)
        for (const playerIn in this.players) {
            if (playerIn != notPlayerId) {
                const player = this.players[playerIn]
                player.socket.emit(...args)
            }
        }
    }

    on(event, callback) {
        if (this.events[event] == undefined) this.events[event] = {}
        for (const playerIn in this.players) {
            const player = this.players[playerIn]
            if (!this.events[event][playerIn]) {
                player.socket.on(event, function () {
                    callback(...arguments, player)
                })
                this.events[event][playerIn] = true
            }
        }
    }

    off(offs) {
        for (const off of offs) {
            delete this.events[off]
            for (const playerIn in this.players) {
                const player = this.players[playerIn]
                if (player.socket.connected) {
                    player.socket.removeAllListeners(off)
                }
            }
        }
    }
}


module.exports = Room