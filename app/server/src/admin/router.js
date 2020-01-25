const path = require('path')

const koaRouter = require('koa-router')
const koaSend = require('koa-send')

const logger = require('../logger/logger')
const loginHash = require('./loginHash')

const router = new koaRouter({ prefix: '/admin/:loginHash' })

router.use('*', async (ctx, next) => {
    if (ctx.params.loginHash.split('/')[0] == loginHash) await next()
    else ctx.body = 'Not Found a'
})


router.get('/logs/', async (ctx) => koaSend(ctx, 'streamLogs.html', { root: path.join(__dirname, 'html/') }))
router.get('/logs/pre', async (ctx) => ctx.body = await logger.getLogsNow())
router.get('/logs/stream', async (ctx) => ctx.body = logger.getLogsNowStream())


router.get('/logs/:date?', async (ctx) => {
    ctx.body = String(await (ctx.params.date == undefined ? logger.getLogsNow() : logger.getLogs(ctx.params.date)))
})

router.get('/dates', async (ctx) => {
    ctx.body = await logger.getDates()
})

router.get('/restart', async (ctx) => {
    logger.log('restarting...')
    ctx.body = 'restarting...'
    process.exit()
    throw 'RESTART'
})


router.get('/rooms', async (ctx) => {
})

module.exports = router