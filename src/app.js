const express = require('express')

const helmet = require('helmet')

const account = require('./routes/account')


const app = express()

app.use(helmet())


// const bodyMiddleware = (req, res, next) => {
//   let ans = []
//   req.on('data', (chunk) => {
//     ans.push(chunk)
//   }).on('end', () => {
//     ans = Buffer.concat(ans).toString()
//     try {
//       req.body = JSON.parse(ans)
//     } catch(e) {
//       req.body = {}
//     }
//     next()
//   })
// }

// app.use(bodyMiddleware)

app.get('/favicon.ico', (req, res) => {
  // 204 No Content
  res.sendStatus(204)
})



app.use('/', account)


app.listen(3000, () => console.log('listening on port 3000'))
