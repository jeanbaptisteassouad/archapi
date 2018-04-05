
const express = require('express')

const router = express.Router()


router.get('/', (req, res) => {
  console.log(res.locals.payload.user_name)
  res.send(res.locals.token)
})


module.exports = router
