const express = require('express')

const helmet = require('helmet')
const bodyParser = require('body-parser')

const account = require('./routes/account')('alpha')

const app = express()


app.use(helmet())

app.use(bodyParser.json())


// For dev to counter cors
app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
  next()
})

app.options('/*', (req, res) => {
  res.sendStatus(200)
})






app.get('/favicon.ico', (req, res) => {
  // 204 No Content
  res.sendStatus(204)
})

app.use('/', account)


app.listen(3000, () => console.log('listening on port 3000'))

