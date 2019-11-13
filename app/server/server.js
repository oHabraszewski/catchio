'use strict'
const log = require('./utils/workerLogger.js')(process.pid)

/* develblock:start */

log(`only in development`)
/* develblock:end */


const path = require('path')

const express = require('express')
const socket_io = require('socket.io')
const datauri = new(require('datauri'))

const JSDOM = require('jsdom').JSDOM
const createServer = require('http').createServer


const app = express()
const server = createServer(app)
const io = socket_io(server)

let users = 0
let index = null

app.use(express.static(path.join(__dirname, '../client/')))
app.use("/assets", express.static(path.join(__dirname, './../assets/')))

log(`server starting`)

async function init() {
    try {
        const dom = await JSDOM.fromFile(path.join(__dirname, 'server_game/index.html'), {
            runScripts: "dangerously",
            resources: "usable",
            pretendToBeVisual: true
        })
        dom.window.WebGLTexture = function () {}
        dom.window.URL.createObjectURL = (blob) => {
            if (blob) return datauri.format(blob.type, blob[Object.getOwnPropertySymbols(blob)[0]]._buffer).content;
        };
        dom.window.URL.revokeObjectURL = (objectURL) => {};
        dom.window.io = io
        dom.window.log = log
        dom.window._updateClientNums = (one_or_negative_one) => {

            users += one_or_negative_one
            // send to master node id and current number of connected clients
            process.send({
                msg: 'updateNums',
                d: {
                    id: index,
                    res: users
                }
            })
        }

        dom.window.gameLoaded = () => {
            // run server on kind of None port
            server.listen(0, () => {
                log('Running redy to accept connections...')
            })

        };
    } catch (err) {
        console.log(err)
    }
}

init();

// if I get new message then read it
process.on('message', function (data, d) {
    switch (data.msg) {
        case 'init':
            // my index is id
            index = data.d
            break
        case 'connection':
            // if master node sends new connection then "call" server
            server.emit('connection', d);
            break;
    }
});
