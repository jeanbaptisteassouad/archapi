
const express = require('express')

const router = express.Router()
const makeUserApi = require('../api/user.js')


module.exports = (index, type) => {

  const user_api = makeUserApi('user_'+index, type)


  router.get('/', (req, res) => {
    res.send(res.locals.token)
  })

  router.get('/fs', (req, res) => {
    user_api.getFs(res.locals.payload.user_name)
    .then(fss => {
      res.send({
        fss,
      })
    })
  })


  return router

}
