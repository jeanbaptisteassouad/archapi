const elasticsearch = require('elasticsearch')
const debugLog = require('../common/debug-log')


const client = elasticsearch.Client({
  host: 'localhost:9200'
})


module.exports = (index) => {
  const type = 't'
  
  const create = (user_agent, date, stack) => {
    const body = {
      user_agent,
      date,
      stack,
    }
    // debugLog('body :',JSON.stringify(body, null, 2))
    return client.create({
      index,
      type,
      id,
      refresh:'wait_for',
      body,
    })
    .then(res => {
      // debugLog('res :',res)
      return res.result === 'created'
    })
    .catch(err => {
      // debugLog('err :',err)
      return false
    })
  }

  const read = (id) => {
    return client.get({
      index,
      type,
      id,
    })
    .then(res => {
      // debugLog('res :',res)
      return res._source
    })
    .catch(err => {
      // debugLog('err :',err)
      return null
    })
  }

  return {
    create
  }
  
}