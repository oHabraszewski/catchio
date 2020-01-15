const data = require('../../data')

module.exports = (id) => {
    delete data.rooms[id]
}