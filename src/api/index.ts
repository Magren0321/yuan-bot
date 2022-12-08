import createError from 'http-errors'
import express from 'express'
import router from './routes/index'

const startServer = () => {
  const app = express()

  // 设置跨域访问
  app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'X-Requested-With')
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
    res.header('X-Powered-By', ' Express')
    res.header('Content-Type', 'application/json;charset=utf-8')
    next()
  })

  router(app)
  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    next(createError(404))
  })

  // error handler
  app.use(function (err: any, req: any, res: any) {
  // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // error
    res.status(err.status || 500)
    res.json({
      message: err.message,
      error: err
    })
  })

  // 监听端口
  app.listen(3030, () => {
    console.log('---------express is listening at prot 3030---------')
  })
}

export default startServer
