const express = require('express')

const intro = require('./introspec')
const makeLogApi = require('../api/log.js')

module.exports = (index) => {

  const log_api = makeLogApi('log_'+index)


  const router = express.Router()

  const extractInfo = (req, res) => {
    const user_agent = req.get('user-agent')
    const date = Date.now()
    const stack = req.body.stack
    const componentStack = req.body.componentStack
    // console.log('user_agent', user_agent)
    // console.log('stack', stack)
    // console.log('componentStack', componentStack)
    // console.log('date', date)
    log_api.create(
      user_agent,
      date,
      stack,
      componentStack
    )
    .then(() => {
      res.sendStatus(201)
    })
  }

  const sendError = (req, res) => {
    const nb = Number(req.query.nb)
    if (isNaN(nb)) {
      // 400 Bad Request
      // res.sendStatus(400)
      intro.send(400,'sendError',{nb},res)
    } else {
      log_api.readXError(nb).then(arr => {
        // console.log(arr)
        res.send(arr)
      }).catch(() => {
        // 400 Bad Request
        // res.sendStatus(400)
        intro.send(400,'sendError',{},res)
      })
    }
  }

  router.post(
    '/browserError',
    extractInfo
  )

  router.get(
    '/browserError',
    sendError
  )


  return router
}
