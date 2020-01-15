const path = require('path')
const createServer = require('http').createServer

const koa = require('koa')
const koaRouter = require('koa-router')
const bodyParser = require('koa-bodyparser')

const koaMount = require('koa-mount')
const koaStatic = require('koa-static')
const staticFiles = (prefix, path) => koaMount(prefix, koaStatic(path))

const app = new koa()
const server = createServer(app.callback())

const router = new koaRouter()

const PORT = process.env.PORT || 8080

app.use(bodyParser())


// routes


app.use(router.routes()).use(router.allowedMethods())

app.use(staticFiles('/', path.join(__dirname, '../../client/')))
app.use(staticFiles('/assets', path.join(__dirname, '../../assets/')))

app.on('error', () =>  console.log(``) )

server.listen(PORT, () => {
    console.log(`back-end server on ${PORT}`)
})