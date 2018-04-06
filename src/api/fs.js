const elasticsearch = require('elasticsearch')
const randomGen = require('../common/random-gen')
const debugLog = require('../common/debug-log')

const client = elasticsearch.Client({
  host: 'localhost:9200'
})


module.exports = (index, type) => {
  
  const createFs = (owner,id) => {
    const body = {
      owner,
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

  return {
    createFs,
  }
  
}