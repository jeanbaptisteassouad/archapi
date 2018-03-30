const express = require('express')

const password = require('./credential/password')
const jwt = require('./credential/json-web-token')

const Api = require('./reason/Api.bs.js')


const headerHasAuth = (req, res, next) => {
  const auth = req.get('Authorization')
  if (auth) {
    res.locals.auth = auth
    next()
  } else {
    // 400 Bad Request
    res.sendStatus(400)
  } 
}

const authIsBasic = (req, res, next) => {
  const arr = res.locals.auth.split(' ')
  if (arr.length === 2 && arr[0] === 'Basic' && arr[1] !== "") {
    res.locals.token = arr[1]
    next()
  } else {
    // 400 Bad Request
    res.sendStatus(400)
  }
}

const decodeBasicAuth = (req, res, next) => {
  const decoded = Buffer.from(res.locals.token, 'base64')
                        .toString('utf8')
                        .split(':')
  if (decoded.length === 2 && decoded[0] !== '' && decoded[1] !== '') {
    res.locals.payload = {
      user_name: decoded[0],
      password: decoded[1],
    }
    next()
  } else {
    // 400 Bad Request
    res.sendStatus(400)
  }
}


const authIsBearer = (req, res, next) => {
  const arr = res.locals.auth.split(' ')
  if (arr.length === 2 && arr[0] === 'Bearer' && arr[1] !== "") {
    res.locals.token = arr[1]
    next()
  } else {
    // 400 Bad Request
    res.sendStatus(400)
  }
}

const decodeBearerAuth = (req, res, next) => {
  jwt.check(res.locals.token)
  .then(payload => {
    res.locals.payload = payload
    next()
  })
  .catch(() => {
    // 400 Bad Request
    res.sendStatus(400)
  })
}

const checkTokenAccessRight = (req, res, next) => {
  if (
    req.params.user_name &&
    res.locals.payload.user_name === req.params.user_name
  ) {
    next()
  } else {
    // 403 Forbidden
    res.sendStatus(403)
  }
}



const userDoesNotExist = (req, res, next) => {
  Api.doesUserExist(res.locals.payload.user_name)
  .then(exist => {
    if (exist) {
      // 409 Conflict
      res.sendStatus(409)
    } else {
      next()
    }
  })
}

const userExist = (req, res, next) => {
  Api.doesUserExist(res.locals.payload.user_name)
  .then(exist => {
    if (exist) {
      next()
    } else {
      // 400 Bad Request
      res.sendStatus(400) 
    }
  })
}


const createUser = (req, res) => {
  password.create(res.locals.payload.password)
  .then(({salt, hash}) => Api.createUser(res.locals.payload.user_name, salt, hash))
  // .then(() => Api.printDb())
  // .then(str => res.send(str))

  // 201 Created
  .then(() => res.sendStatus(201))
}

const checkUserPassword = (req, res, next) => {
  Api.getUserSaltAndHash(res.locals.payload.user_name)
  .then(({salt,hash}) => password.check(salt, hash, res.locals.payload.password))
  .then(match => {
    if (match) {
      next()
    } else {
      let ms = Math.random()*1000
      // 403 Forbidden
      setTimeout(()=>res.sendStatus(403), ms)
    }
  })
}

const sendToken = (req, res) => {
  const payload = {
    user_name:res.locals.payload.user_name,
  }
  jwt.create(payload)
  .then(token => {
    res.send({
      token
    })
  })
}

const forbidden = (req, res) => {
  // 403 Forbidden
  res.sendStatus(403)
}

const router = express.Router()

router.post(
  '/',
  headerHasAuth,
  authIsBasic,
  decodeBasicAuth,
  userDoesNotExist,
  createUser
)

router.get(
  '/',
  headerHasAuth,
  authIsBasic,
  decodeBasicAuth,
  userExist,
  checkUserPassword,
  sendToken
)

const user = require('./user')

router.use(
  '/users/:user_name',
  headerHasAuth,
  authIsBearer,
  decodeBearerAuth,
  checkTokenAccessRight,
  user
)

router.use('*', forbidden)

module.exports = router
