const MAX_PLAYERS_IN_ROOM = 2
const MIN_PLAYERS_IN_ROOM_TO_START_GAME = 2

const GENERATE_CONFIGS_CONFIGS = {
    maps: [
        {
            id: '1',
            startPosition: {
                x: 200,
                y: 500,
                ballY: 400
            }
        },
        {
            id: '2',
            startPosition: {
                x: 200,
                y: 500,
                ballY: 400
            }
        },
        {
            id: '3',
            startPosition: {
                x: 200,
                y: 500,
                ballY: 400
            }
        }
    ],
    sprites: ['player1', 'player2']
}


let rooms = {}
let roomsId = 0

module.exports = {
    rooms,
    roomsId,

    const: {
        MAX_PLAYERS_IN_ROOM,
        MIN_PLAYERS_IN_ROOM_TO_START_GAME,
        GENERATE_CONFIGS_CONFIGS
    }
}


