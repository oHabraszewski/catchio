const koaRouter = require('koa-router')

const router = new koaRouter({ prefix: 'admin' })

router.get('logs')