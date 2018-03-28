
const randomGen = require('./random-gen')
const jwt = require('jsonwebtoken')

const secretKey = randomGen(64)

const option = {
    algorithm: 'HS512',
    expiresIn: '10m' // if ommited, the token will not expire
}

exports.create = (payload) => new Promise((resolve, reject) => {
  jwt.sign(payload, secretKey, option, (err, token) => {
    if (err) reject(err)
    resolve(token)
  })
})

exports.check = (token) => new Promise((resolve, reject) => {
  jwt.verify(token, secretKey, option, (err, decoded) => {
    if (err) reject(err)
    resolve(decoded)
  })
})
