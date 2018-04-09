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

  const read = (req, res) => {
    const fs_id = req.params.fs_id
    const account_name = res.locals.payload.account_name
    fs_api.read(fs_id)
    .then(fs => {
      if (fs && fs.owner === account_name) {
        // 200 Ok
        res.status(200)
        res.send(fs)
      } else {
        // 404 Not Found
        res.sendStatus(404)
      }
    })
  }

  router.post(
    '/:fs_id',
    create
  )

  router.get(
    '/:fs_id',
    read
  )

  return router
}