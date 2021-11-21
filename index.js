const express = require('express')

const middleware = require('./middleware')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.disable('x-powered-by')

app.use('/api', middleware)

const port = process.env.HTTP_PORT || 4000

app.listen(port, () => {
  console.log('Server is up and running on port', port)
})
