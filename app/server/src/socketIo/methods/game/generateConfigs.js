const randomArrayElement = require('../../../utils/randomArrayElement')
const data = require('../../data')

module.exports = (room) => {
    const configs = {
        map: randomArrayElement(data.const.GENERATE_CONFIGS_CONFIGS.maps)
    }

    resetSprites()
    const forEachPlayer = {}
    for (const playerId in room.players) {
        forEachPlayer[playerId] = {}
        forEachPlayer[playerId].spriteId = getSprite()
    }

    return { configs, forEachPlayer }
}

let ids = []
let idsIndex = 0
function resetSprites() {
    idsIndex = 0
    ids = data.const.GENERATE_CONFIGS_CONFIGS.sprites
    0.5 > Math.random() ? ids : ids.reverse()
}

function getSprite() {
    const id = ids[idsIndex]
    idsIndex++
    return id
}
