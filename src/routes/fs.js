const express = require('express')
const debugLog = require('../common/debug-log')


const makeFsApi = require('../api/fs.js')


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
        res.sendStatus(409)
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
        res.sendStatus(404)
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
      res.sendStatus(404)
    }
  }

  const sendFs = (req, res, next) => {
    const fs = res.locals.readFs_fs
    res.send(fs)
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

  router.get(
    '/:fs_id/*',
    (req, res) => {
      const arr = req.path
        .split('/')
        .slice(2)
        .map(e=>req.params.fs_id+e)
      console.log(arr)
      res.sendStatus(200)
    }
  )

  return router
}