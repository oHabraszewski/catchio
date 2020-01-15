const randomArrayElement = require('../../../utils/randomArrayElement')
const data = require('../../data')

module.exports = (room, changePlayers = true) => {
    const configs = {
        // map: randomArrayElement(data.const.GENERATE_CONFIGS_CONFIGS.maps)
        map: data.const.GENERATE_CONFIGS_CONFIGS.maps[0]
    }

    const spritesIds = [...data.const.GENERATE_CONFIGS_CONFIGS.sprites]
    if (0.5 > Math.random()) spritesIds.reverse()

    let sprites = {}
    if (changePlayers) {
        let i = 0
        for (const playerId in room.players) {
            sprites[playerId] = spritesIds[i]
            room.players[playerId].sprite = spritesIds[i]
            i++
        }
    } else {
        for (const playerId in room.players) {
            sprites[playerId] = room.players[playerId].sprite
        }
    }



    configs.sprites = sprites
    return configs
}



// const randomArrayElement = require('../../../utils/randomArrayElement')
// const data = require('../../data')

// module.exports = (room) => {
//     const configs = {
//         // map: randomArrayElement(data.const.GENERATE_CONFIGS_CONFIGS.maps)
//         map: data.const.GENERATE_CONFIGS_CONFIGS.maps[0]
//     }

//     resetSprites()
//     const forEachPlayer = {}
//     for (const playerId in room.players) {
//         forEachPlayer[playerId] = {}
//         forEachPlayer[playerId].spriteId = getSprite()
//     }

//     return { configs, forEachPlayer }
// }

// let ids = []
// let idsIndex = 0
// function resetSprites() {
//     idsIndex = 0
//     ids = data.const.GENERATE_CONFIGS_CONFIGS.sprites
//     0.5 > Math.random() ? ids : ids.reverse()
// }

// function getSprite() {
//     const id = ids[idsIndex]
//     idsIndex++
//     return id
// }
