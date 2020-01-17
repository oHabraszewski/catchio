const logger = require('../logger/logger')

const koaRouter = require('koa-router')
const loginHash = require('./loginHash')

const router = new koaRouter({ prefix: '/admin/:loginHash' })

router.use('*', async (ctx, next) => {
    if (ctx.params.loginHash.split('/')[0] == loginHash) await next()
    else ctx.body = 'Not Found'

})

router.get('/logs/:date?', async (ctx) => {
    ctx.body = String(await (ctx.params.date == undefined ? logger.getLogsNow() : logger.getLogs(ctx.params.date)))
})


router.get('/dates', async (ctx) => {
    ctx.body = await logger.getDates()
})

module.exports = router