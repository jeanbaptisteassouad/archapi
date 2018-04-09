const express = require('express')

const helmet = require('helmet')

const account = require('./routes/account')('alpha')

const app = express()


app.use(helmet())

app.get('/favicon.ico', (req, res) => {
  // 204 No Content
  res.sendStatus(204)
})

app.use('/', account)


app.listen(3000, () => console.log('listening on port 3000'))

