const express = require('express')


module.exports = (index) => {

  const router = express.Router()

  const extractInfo = (req, res) => {
    const user_agent = req.get('user-agent')
    const date = Date.now()
    const stack = req.body.stack
    const componentStack = req.body.componentStack
    console.log('user_agent', user_agent)
    console.log('stack', stack)
    console.log('componentStack', componentStack)
    console.log('date', date)
    res.sendStatus(200)
  }

  router.post(
    '/browserError',
    extractInfo
  )


  return router
}
