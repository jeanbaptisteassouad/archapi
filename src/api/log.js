const elasticsearch = require('elasticsearch')
const debugLog = require('../common/debug-log')


const client = elasticsearch.Client({
  host: 'localhost:9200'
})


module.exports = (index) => {
  const type = 't'

  const create = (obj) => {
    const date = Date.now()
    const body = Object.assign({},obj,{date})
    // debugLog('body :',JSON.stringify(body, null, 2))
    return client.index({
      index,
      type,
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

  const readX = (nb) => {
    const body = {
      sort : [
        { date : 'desc' },
      ],
      query : {
          match_all : {}
      },
      "size" : nb
    }
    // debugLog('body :',JSON.stringify(body, null, 2))
    return client.search({
      index,
      body,
    })
    .then(res => {
      // debugLog('res :',res)
      return res.hits.hits.map(a => a._source)
    })
    .catch(err => {
      // debugLog('err :',err)
      return null
    })
  }


  return {
    create,
    readX,
  }
  
}