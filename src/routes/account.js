const express = require('express')

const password = require('./credential/password')
const jwt = require('./credential/json-web-token')

const makeAccountApi = require('../api/account.js')

const fs = require('./fs')
const log = require('./log')

const intro = require('./introspec')


module.exports = (index) => {

  const account_api = makeAccountApi('account_'+index)

  const headerHasAuth = (req, res, next) => {
    const auth = req.get('Authorization')
    if (auth) {
      res.locals.auth = auth
      next()
    } else {
      // 400 Bad Request
      // res.sendStatus(400)
      intro.send(400,'headerHasAuth',{auth},res)
    }
  }

  const headerHasNotAuth = (req, res, next) => {
    const auth = req.get('Authorization')
    if (auth) {
      // 400 Bad Request
      // res.sendStatus(400)
      intro.send(400,'headerHasNotAuth',{auth},res)
    } else {
      next()
    }
  }

  const authIsBasic = (req, res, next) => {
    const arr = res.locals.auth.split(' ')
    if (arr.length === 2 && arr[0] === 'Basic' && arr[1] !== "") {
      res.locals.token = arr[1]
      next()
    } else {
      // 400 Bad Request
      // res.sendStatus(400)
      intro.send(400,'authIsBasic',{arr},res)
    }
  }

  const decodeBasicAuth = (req, res, next) => {
    const decoded = Buffer.from(res.locals.token, 'base64')
                          .toString('utf8')
                          .split(':')
    if (decoded.length === 2 && decoded[0] !== '' && decoded[1] !== '') {
      res.locals.payload = {
        account_name: decoded[0],
        password: decoded[1],
      }
      next()
    } else {
      // 400 Bad Request
      // res.sendStatus(400)
      intro.send(400,'decodeBasicAuth',{decoded},res)
    }
  }

  const okIfLeaf = (req, res, next) => {
    if (req.path === '/') {
      // 200 Ok
      res.sendStatus(200)
    } else {
      next()
    }
  }

  const authIsBearer = (req, res, next) => {
    const arr = res.locals.auth.split(' ')
    if (arr.length === 2 && arr[0] === 'Bearer' && arr[1] !== "") {
      res.locals.token = arr[1]
      next()
    } else {
      // 400 Bad Request
      // res.sendStatus(400)
      intro.send(400,'authIsBearer',{arr},res)
    }
  }

  const decodeBearerAuth = (req, res, next) => {
    jwt.check(res.locals.token)
    .then(payload => {
      res.locals.payload = payload
      next()
    })
    .catch(() => {
      let ms = Math.random()*1000
      // 400 Bad Request
      // setTimeout(()=>res.sendStatus(400), ms)
      setTimeout(()=>intro.send(400,'decodeBearerAuth',{token:res.locals.token},res), ms)
    })
  }



  const accountDoesNotExist = (req, res, next) => {
    const account_name = res.locals.payload.account_name
    account_api.exist(account_name)
    .then(exist => {
      if (exist) {
        // 409 Conflict
        // res.sendStatus(409)
        intro.send(409,'accountDoesNotExist',{account_name},res)
      } else {
        next()
      }
    })
  }

  const accountExist = (req, res, next) => {
    const account_name = res.locals.payload.account_name
    account_api.exist(account_name)
    .then(exist => {
      if (exist) {
        next()
      } else {
        // 400 Bad Request
        // res.sendStatus(400)
        intro.send(400,'accountExist',{account_name},res)
      }
    })
  }


  const createAccount = (req, res) => {
    const account_name = res.locals.payload.account_name
    const pswd = res.locals.payload.password
    password.create(pswd)
    .then(({salt, hash}) => account_api.create(account_name, salt, hash))
    .then(created => {
      if (created) {
        // 201 Created
        res.sendStatus(201)
      } else {
        // 409 Conflict
        // res.sendStatus(409)
        intro.send(409,'createAccount',{account_name,pswd},res)
      }
    })
  }

  const checkAccountPassword = (req, res, next) => {
    const account_name = res.locals.payload.account_name
    const pswd = res.locals.payload.password
    account_api.saltAndHash(account_name)
    .then(({salt,hash}) => password.check(salt, hash, pswd))
    .then(match => {
      if (match) {
        next()
      } else {
        let ms = Math.random()*1000
        // 403 Forbidden
        // setTimeout(()=>res.sendStatus(403), ms)
        setTimeout(()=>intro.send(403,'checkAccountPassword',{account_name,pswd},res), ms)
      }
    })
  }

  const sendToken = (req, res) => {
    const payload = {
      account_name:res.locals.payload.account_name,
    }
    jwt.create(payload)
    .then(token => {
      res.send({
        token
      })
    })
  }

  const forbidden = (req, res) => {
    let ms = Math.random()*1000
    // 403 Forbidden
    // setTimeout(()=>res.sendStatus(403),ms)
    setTimeout(()=>intro.send(403,'forbidden',{path:req.path},res), ms)
  }



  const router = express.Router()

  router.use(
    '/basic',
    headerHasAuth,
    authIsBasic,
    decodeBasicAuth,
    okIfLeaf
  )

  router.post(
    '/basic/account',
    accountDoesNotExist,
    createAccount
  )

  router.get(
    '/basic/account',
    accountExist,
    checkAccountPassword,
    sendToken
  )

  router.use(
    '/bearer',
    headerHasAuth,
    authIsBearer,
    decodeBearerAuth,
    okIfLeaf
  )

  router.use(
    '/none',
    headerHasNotAuth,
    okIfLeaf
  )

  router.use('/bearer/fs', fs(index))
  router.use('/none/log', log(index))

  router.use('*', forbidden)

  return router
}
