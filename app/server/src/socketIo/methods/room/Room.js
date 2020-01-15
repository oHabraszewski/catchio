class Room {
    constructor() {
        this.players = {}
        this.playersCount = 0
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
        for (const playerIn in this.players) {
            if (playerIn != notPlayerId) {
                const player = this.players[playerIn]
                player.socket.emit(...arguments)
            }
        }
    }
}


module.exports = Room