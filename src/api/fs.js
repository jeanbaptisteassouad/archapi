const elasticsearch = require('elasticsearch')
const randomGen = require('../common/random-gen')
const debugLog = require('../common/debug-log')
const tree = require('../common/tree')


const client = elasticsearch.Client({
  host: 'localhost:9200'
})


module.exports = (index) => {
  const type = 't'
  
  const create = (owner,id) => {
    const body = {
      owner,
      tree:tree.init(id)
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

  const push = (path,size,id) => {
    return read(id)
    .then(fs => {
      if (fs) {
        tree.update([id].concat(path),size,fs.tree)
        const body = {
          doc: {
            tree:fs.tree
          }
        }
        // debugLog('body :',JSON.stringify(body, null, 2))
        return client.update({
          index,
          type,
          id,
          // refresh:'wait_for',
          body
        })
        .then(res => {
          // debugLog('res :',res)
          return res.result === 'updated'
        })
        .catch(err => {
          // debugLog('err :',err)
          return false
        })
      } else {
        return false
      }
    })
  }

  return {
    create,
    read,
    push
  }
  
}