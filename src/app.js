const express = require('express')
const app = express()

const helmet = require('helmet')
app.use(helmet())


const bodyMiddleware = (req, res, next) => {
  let ans = []
  req.on('data', (chunk) => {
    ans.push(chunk)
  }).on('end', () => {
    ans = Buffer.concat(ans).toString()
    try {
      req.body = JSON.parse(ans)
    } catch(e) {
      req.body = {}
    }
    next()
  })
}

app.use(bodyMiddleware)

app.get('/favicon.ico', function(req, res) {
    res.sendStatus(204)
})

const user = require('./user')

app.use('/', user)


app.listen(3000, () => console.log('listening on port 3000'))
