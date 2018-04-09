const elasticsearch = require('elasticsearch')
const randomGen = require('../common/random-gen')
const debugLog = require('../common/debug-log')

const client = elasticsearch.Client({
  host: 'localhost:9200'
})

module.exports = (index) => {
  const type = 't'
  // const makeIndex = () => {
  //   const body = {
  //     mappings: {
  //       [type]: {
  //         properties: {
  //           name: { "type" : "keyword" },
  //           salt: { "type" : "keyword" },
  //           hash: { "type" : "keyword" },
  //         }
  //       }
  //     }
  //   }
  //   // debugLog('body :',JSON.stringify(body, null, 2))
  //   return client.indices.create({
  //     index,
  //     body,
  //   })
  //   .then(res => {
  //     // debugLog('res :',res)
  //     return res
  //   })
  //   .catch(err => {
  //     // debugLog('err :',err)
  //     return err
  //   })
  // }

  const create = (name,salt,hash) => {
    const body = {
      salt,
      hash
      // fss:[]
    }
    // debugLog('body :',JSON.stringify(body, null, 2))
    return client.create({
      index,
      type,
      id:name,
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

  const exist = (name) => {
    return client.get({
      index,
      type,
      id: name
    })
    .then(res => {
      // debugLog('res :',res)
      return res.found === true
    })
    .catch(err => {
      // debugLog('err :',err)
      return false
    })
  }

  const saltAndHash = (name) => {
    return client.get({
      index,
      type,
      id: name
    })
    .then(res => {
      // debugLog('res :',res)
      return {
        salt:res._source.salt,
        hash:res._source.hash
      }
    })
    .catch(err => {
      // debugLog('err :',err)
      return {
        salt:'',
        hash:''
      }
    })
  }
  
  return {
    create,
    exist,
    saltAndHash
  }
}

