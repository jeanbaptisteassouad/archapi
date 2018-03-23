const express = require('express')
const app = express()

const helmet = require('helmet')
app.use(helmet())

const password = require('./password')

const Api = require('./Api.bs.js')

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

app.get('/', (req, res) => res.send('Hello World!'))


app.post('/:user_name', (req, res) => {
  // prevent null, undefined and "" to be valid password
  if (req.body.password) {
    Api.doesUserExist(req.params.user_name)
      .then(exist => {
        if (exist) {
          res.sendStatus(409)
        } else {
          password.create(req.body.password)
            .then(({salt, hash}) => Api.createUser(req.params.user_name, salt, hash)
              .then(Api.printDb()
                .then(str => res.send(str))))
        }
      })
  } else {
    res.sendStatus(404)
  }
})


// app.get('/:user_name', (req, res) => {
//   if (req.body.token) {
//     if (Api.doesUserExist(req.params.user_name)) {
//       if (Api.doesTokenMatchUser(req.body.token, req.params.user_name))
//     }
//   } else {

//   }

// })



app.listen(3000, () => console.log('Example app listening on port 3000!'))

// const body = req => new Promise((resolve, reject) => {
//   let ans = []
//   req.on('data', (chunk) => {
//     ans.push(chunk)
//   }).on('end', () => {
//     ans = Buffer.concat(ans).toString()
//     try {
//       resolve(JSON.parse(ans))
//     } catch(e) {
//       reject(e)
//     }
//   })
// })