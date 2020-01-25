// module.exports = exports = {}
const path = require('path')
const createServer = require('http').createServer

const koa = require('koa')
const koaRouter = require('koa-router')
const koaJson = require('koa-json')

const koaMount = require('koa-mount')
const koaStatic = require('koa-static')
const staticFiles = (prefix, path) => koaMount(prefix, koaStatic(path))
// exports.staticFiles = staticFiles

const socketIo = require('socket.io')
const logger = require('./logger/logger')
logger.createLogsFile()

const app = new koa()
const server = createServer(app.callback())
const io = socketIo(server)

const router = new koaRouter()

const PORT = process.env.PORT || 8080

app.use(koaJson())

const connection = require('./socketIo/connection')
io.on('connection', async (socket) => {
    connection.connect(socket)
})


const adminRoutes = require('./admin/router')
router.use(adminRoutes.routes())
app.use(router.routes()).use(router.allowedMethods())

app.use(staticFiles('/', path.join(__dirname, '../../client/')))
app.use(staticFiles('/assets', path.join(__dirname, '../../assets/')))

app.on('error', () => console.log(``))

server.listen(PORT, () => {
    console.log(`back-end server on ${PORT}`)
})

