const elasticsearch = require('elasticsearch')
const randomGen = require('../common/random-gen')
const debugLog = require('../common/debug-log')

const client = elasticsearch.Client({
  host: 'localhost:9200'
})


// // User
// doesUserExist
// createUser
// getUserSaltAndHash
// getFsId

// /us/canard

// // FF
// createFs (fs_id) =>
// pushFs (fs_id,path,size) =>
// deleteFs (fs_id) =>


module.exports = (index, type) => {
  const makeIndex = () => {
    const body = {
      mappings: {
        [type]: {
          properties: {
            name: { "type" : "keyword" },
            salt: { "type" : "keyword" },
            hash: { "type" : "keyword" },
          }
        }
      }
    }
    // debugLog('body :',JSON.stringify(body, null, 2))
    return client.indices.create({
      index,
      body,
    })
    .then(res => {
      // debugLog('res :',res)
      return res
    })
    .catch(err => {
      // debugLog('err :',err)
      return err
    })
  }

  const createUser = (name,salt,hash) => {
    const body = {
      salt,
      hash,
      fss:[]
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

  const doesUserExist = (name) => {
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

  const getUserSaltAndHash = (name) => {
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

  const pushFs = (fs_id,name) => {
    return getFs(name)
    .then(old_ffs => {
      const body = {
        doc:{
          fss:old_ffs.concat([fs_id])
        }
      }
      // debugLog('body :',JSON.stringify(body, null, 2))
      return client.update({
        index,
        type,
        id: name,
        refresh:'wait_for',
        body,
      })
      .then(res => {
        // debugLog('res :',res)
        return res.result === 'updated'
      })
      .catch(err => {
        // debugLog('err :',err)
        return false
      })
    })
  }

  const getFs = (name) => {
    return client.get({
      index,
      type,
      id: name
    })
    .then(res => {
      // debugLog('res :',res)
      return res._source.fss
    })
    .catch(err => {
      // debugLog('err :',err)
      return []
    })
  }
  
  return {
    createUser,
    doesUserExist,
    getUserSaltAndHash,
    pushFs,
    getFs,
  }
}

// const M = module.exports(Math.floor(Math.random() * 255000),'type')

// const name = randomGen(60)
// M.makeIndex()
// .then(() => M.createUser(name,randomGen(60),randomGen(60)).then(b=>console.log(b)))
// .then(() => M.doesUserExist(name).then(b=>console.log(b)))
// .then(() => M.doesUserExist(randomGen(60)).then(b=>console.log(b)))
// .then(() => M.createUser(name,randomGen(60),randomGen(60)).then(b=>console.log(b)))
// .then(() => M.getUserSaltAndHash(name).then(b=>console.log(b)))


