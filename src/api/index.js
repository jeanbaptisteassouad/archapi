
const elasticsearch = require('elasticsearch')
const debugLog = require('../common/debug-log')
const deepEqual = require('deep-equal')


const client = elasticsearch.Client({
  host: 'localhost:9200'
})


const makeMappings = (properties) => {
  const type = 't'
  return {
    [type]: {
      properties
    }
  }
}

exports.create = (properties,index) => {
  const body = {
    mappings: makeMappings(properties)
  }
  // debugLog('body :',JSON.stringify(body, null, 2))
  return client.indices.create({
    index,
    body,
  })
  .then(res => {
    // debugLog('res :',res)
    return res.acknowledged === true
  })
  .catch(err => {
    // debugLog('err :',err)
    return false
  })
}

exports.exists = (index) => {
  return client.indices.exists({
    index
  })
  .then(res => {
    // debugLog('res :',res)
    return res
  })
  .catch(err => {
    // debugLog('err :',err)
    return false
  })
}

exports.checkProps = (properties,index) => {
  return client.indices.get({
    index
  })
  .then(res => {
    return deepEqual(res[index].mappings,makeMappings(properties))
  })
  .catch(err => {
    debugLog('err :',err)
    return false
  })
}


const doTheThrow = (properties,index) => {
  throw new Error(
    'Ensure : index = '+index+' to have props = '+JSON.stringify(properties, null, 2)
  )
}

exports.ensure = (properties,index) => {
  return exports.exists(index)
  .then(index_exists => {
    if (index_exists) {
      return exports.checkProps(properties,index)
        .then(same_props => {
          if (same_props) {
            return null
          } else {
            doTheThrow(properties,index)
          }
        })
    } else {
      return exports.create(properties,index)
        .then(was_created => {
          if (was_created) {
            return null
          } else {
            doTheThrow(properties,index)
          }
        })
    }
  })
}