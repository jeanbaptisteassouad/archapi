const express = require('express')

const intro = require('./introspec')
const makeLogApi = require('../api/log.js')

module.exports = (index) => {

  const log_error = makeLogApi('log_error'+index)
  const log_nb_files = makeLogApi('log_nb_files'+index)


  const router = express.Router()

  const extractInfo = (req, res) => {
    const user_agent = req.get('user-agent')
    const date = Date.now()
    const stack = req.body.stack
    const componentStack = req.body.componentStack
    log_error.create({
      user_agent,
      stack,
      componentStack
    })
    .then(() => {
      res.sendStatus(201)
    })
  }

  const sendError = (req, res) => {
    const nb = Number(req.query.nb)
    if (isNaN(nb)) {
      // 400 Bad Request
      intro.send(400,'sendError',{nb},res)
    } else {
      log_error.readX(nb).then(arr => {
        res.send(arr)
      }).catch(() => {
        // 400 Bad Request
        intro.send(400,'sendError',{},res)
      })
    }
  }

  const receiveNbFiles = (req, res) => {
    const date = Date.now()
    const nb_files = req.body.nb_files
    log_nb_files.create({
      nb_files,
    })
    .then(() => {
      res.sendStatus(201)
    })
  }

  const sendNbFiles = (req, res) => {
    const nb = Number(req.query.nb)
    if (isNaN(nb)) {
      // 400 Bad Request
      intro.send(400,'sendError',{nb},res)
    } else {
      log_nb_files.readX(nb).then(arr => {
        res.send(arr)
      }).catch(() => {
        // 400 Bad Request
        intro.send(400,'sendError',{},res)
      })
    }
  }

  router.route('/browserError')
        .post(extractInfo)
        .get(sendError)

  router.route('/nbFiles')
        .post(receiveNbFiles)
        .get(sendNbFiles)


  return router
}
