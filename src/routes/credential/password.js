
const randomGen = require('./random-gen')
const crypto = require('crypto')

exports.create = (pw) => new Promise((resolve, reject) => {
  let salt = randomGen(64)
  computeHash(pw, salt).then(buff => {
    resolve({
      salt: salt,
      hash: buffToStr(buff)
    })
  })
})


const computeHash = (pw, salt) => new Promise((resolve, reject) => {
  crypto.pbkdf2(pw, salt, 100000, 512, 'sha512', (err, derivedKey) => {
    if (err) reject(err)
    resolve(derivedKey)
  })
})

exports.check = (salt,hash,pw) => new Promise((resolve, reject) => {
  computeHash(pw, salt).then(buff => {
    resolve(buffToStr(buff) === hash)
  })
})

const buffToStr = buff => buff.toString('hex')