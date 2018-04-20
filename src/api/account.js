const elasticsearch = require('elasticsearch')
const randomGen = require('../common/random-gen')
const debugLog = require('../common/debug-log')

const I = require('./index')

const client = elasticsearch.Client({
  host: 'localhost:9200'
})

const props = {
  name: { 'type' : 'keyword' },
  salt: { 'type' : 'keyword' },
  hash: { 'type' : 'keyword' },
}

module.exports = (index) => {
  // I.ensure(props,index)

  const type = 't'

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

