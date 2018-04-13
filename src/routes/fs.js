const express = require('express')
const debugLog = require('../common/debug-log')


const makeFsApi = require('../api/fs.js')


const intro = require('./introspec')


module.exports = (index) => {
  const router = express.Router()
  const fs_api = makeFsApi('fs_'+index)

  const create = (req, res) => {
    const fs_id = req.params.fs_id
    const account_name = res.locals.payload.account_name
    fs_api.create(account_name, fs_id)
    .then(created => {
      if (created) {
        // 201 Created
        res.sendStatus(201)
      } else {
        // 409 Conflict
        // res.sendStatus(409)
        intro.send(409,'create',{fs_id,account_name},res)
      }
    })
  }

  const readFs = (req, res, next) => {
    const fs_id = req.params.fs_id
    fs_api.read(fs_id)
    .then(fs => {
      if (fs) {
        res.locals.readFs_fs = fs
        next()
      } else {
        // 404 Not Found
        // res.sendStatus(404)
        intro.send(404,'readFs',{fs_id},res)
      }
    })
  }

  const accountIsOwner = (req, res, next) => {
    const account_name = res.locals.payload.account_name
    const fs = res.locals.readFs_fs
    if (fs.owner === account_name) {
      next()
    } else {
      // 404 Not Found
      // res.sendStatus(404)
      intro.send(404,'accountIsOwner',{account_name},res)
    }
  }

  const sendFs = (req, res) => {
    const fs = res.locals.readFs_fs
    res.send(fs)
  }


  const pushPath2Fs = (req, res) => {
    const size = 1
    const fs_id = req.params.fs_id
    const path = req.path
      .split('/')
      .slice(2)
    fs_api.push(path,size,fs_id)
    .then(pushed => {
      if (pushed) {
        // 200 Ok
        res.sendStatus(200)
      } else {
        // 404 Not Found
        // res.sendStatus(404)
        intro.send(404,'pushPath2Fs',{fs_id,path},res)
      }
    })
  }


  router.post(
    '/:fs_id',
    create
  )

  router.use(
    '/:fs_id',
    readFs,
    accountIsOwner
  )

  router.get(
    '/:fs_id',
    sendFs
  )

  router.post(
    '/:fs_id/*',
    pushPath2Fs
  )

  return router
}