const express = require('express')

const middleware = require('./middleware')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.disable('x-powered-by')

if (process.env.COVINCE_ENABLE_CORS) {
  app.use(require('cors')())
}

const API_PREFIX = process.env.COVINCE_API_PREFIX || '/api'

app.use(API_PREFIX, middleware)

const port = process.env.HTTP_PORT || 4000

app.use(function errorHandler (err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }
  res.sendStatus(500) // silent error message
})

app.listen(port, () => {
  console.log('Server is up and running on port', port)
})
