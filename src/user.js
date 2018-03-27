
const express = require('express')
const router = express.Router()

const password = require('./credential/password')
const jwt = require('./credential/json-web-token')

const Api = require('./reason/Api.bs.js')


const bodyHasPassword = (req, res, next) => {
  if (req.body.password) {
    next()
  } else {
    // 400 Bad Request
    res.sendStatus(400)
  }
}



router.post('/:user_name', bodyHasPassword)

router.post('/:user_name', (req, res, next) => {
  Api.doesUserExist(req.params.user_name)
  .then(exist => {
    if (exist) {
      // 409 Conflict
      res.sendStatus(409)
    } else {
      next()
    }
  })
})

router.post('/:user_name', (req, res) => {
  password.create(req.body.password)
  .then(({salt, hash}) => Api.createUser(req.params.user_name, salt, hash))
  .then(() => Api.printDb())
  .then(str => res.send(str))
})



const headerHasAuthorization = (req, res, next) => {
  const auth = req.get('Authorization')
  if (auth) {
    let arr = auth.split(' ')
    if (arr.length === 2 && arr[0] === 'Bearer' && arr[1] !== "") {
      res.locals.token = arr[1]
      next()
    } else {
      // 403 Forbidden
      res.sendStatus(403)
    }
  } else {
    // 403 Forbidden
    res.sendStatus(403)
  } 
}

router.get('/:user_name', headerHasAuthorization)

router.get('/:user_name', (req, res) => {
  res.send(res.locals.token)
})






router.get('/:user_name/token', bodyHasPassword)

router.get('/:user_name/token', (req, res, next) => {
  Api.doesUserExist(req.params.user_name)
  .then(exist => {
    if (exist) {
      next()
    } else {
      // 400 Bad Request
      res.sendStatus(400) 
    }
  })
})

router.get('/:user_name/token', (req, res, next) => {
  Api.getUserSaltAndHash(req.params.user_name)
  .then(({salt,hash}) => password.check(salt, hash, req.body.password))
  .then(match => {
    if (match) {
      next()
    } else {
      // 403 Forbidden
      res.sendStatus(403)
    }
  })
})

router.get('/:user_name/token', (req, res) => {
  const payload = {
    user_name:req.params.user_name,
  }
  jwt.create(payload)
  .then(token => {
    res.send({
      token
    })
  })
})



module.exports = router
