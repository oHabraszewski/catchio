const data = require('../../data')
const Room = require('./Room')
module.exports = () => {
    data.roomsId++
    data.rooms[data.roomsId] = new Room()
}