const express = require('express')

const createMiddleware = require('./middleware')
const knex = require('./db')

const app = express()
app.set('query string', 'simple')

app.disable('x-powered-by')

if (process.env.COVINCE_ENABLE_CORS) {
  app.use(require('cors')())
}

const API_PREFIX = process.env.COVINCE_API_PREFIX || '/api'

app.use(API_PREFIX, createMiddleware(knex))

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
