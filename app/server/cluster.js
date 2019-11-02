// worke and server are the same in comments
'use strict'

const cluster = require('cluster')

// if node is main
if (cluster.isMaster) {
    // set up some configs
    const config = {
        maxNumberOfClients: 4
    }
    // tcp is a coupple laures lower than http is, so we can grab 
    // htt connection via tcp and forward it to real http
    const TcpCreateServer = require('net').createServer
    // define main node port 
    const PORT = process.env.PORT || 8000
    // define our workers/servers table
    let workers = []
    // define table to keep track of number of clienst
    let numOfCliens = []

    // spawn first server
    spawn(0)
    // create TCP server
    const server = TcpCreateServer()

    server.on('connection', (socket) => {
        // make some magic so TCP don't block http
        socket._handle.readStop();
        socket.pause()
        // loop through numbers and find firs server with availables slots
        let len = numOfCliens.length
        // console.log(numOfCliens)
        for (let i = 0; i < len; i++) {
            // if server have available slots
            if (numOfCliens[i] < config.maxNumberOfClients) {
                // if so sen him the connection
                workers[i].send({
                    msg: 'connection',
                }, socket)
                break
            }
        }

    })
    // listen with main TCP server
    server.listen(PORT, {
        // make some magic so TCP don't block http
        pauseOnConnect: true
    }, () => {
        console.log(`Master on ${PORT}`)
    });
    // spawns new woker/server
    function spawn(i) {
        numOfCliens[i] = 0
        // fork cluser => require('./main.js')
        workers[i] = cluster.fork()
        // if cluster have error then respawn it
        workers[i].on('error', () => {
            console.log(`some error worker error...`)
            workers[i] = null
            spawn(i)
        })
        // send id to worker
        // id == index in wokers && numOfCliens arrays, those indexes are the same
        workers[i].send({
            msg: 'init',
            d: i
        })
        // whati for worker message so he can tell us how
        // many clients does he have
        workers[i].on('message', (data) => {
            switch (data.msg) {
                case 'updateNums':
                    // update client amount
                    numOfCliens[data.d.id] = data.d.res
                    // if last wokrer in array have more or equal clients than maxNumberOfClients / 2, spawn new worker/server
                    if (numOfCliens[numOfCliens.length - 1] >= Math.floor(config.maxNumberOfClients / 2)) {
                        console.log('spawnig new...')
                        spawn(numOfCliens.length)
                    }

                    // if last worker have 0 clients and before last have less than config.maxNumberOfClients / 2, then remove last woker
                    if (numOfCliens[numOfCliens.length - 1] == 0 && numOfCliens[numOfCliens.length - 2] < Math.floor(config.maxNumberOfClients / 2)) {
                        remove(numOfCliens.length - 1) // someteching is wrong TODO FIX // <== me form future idk if it's broken
                    }
                    break
            }
        })
    }
    // remove worker/server
    function remove(i) {
        // kill him
        workers[i].kill()
        workers.splice(i, 1)
        numOfCliens.splice(i, 1)
        console.log(`removing server...`)
    }

} else {
    // if node is not master
    require('./server.js')
}