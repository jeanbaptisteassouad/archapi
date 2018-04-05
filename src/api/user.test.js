const chai = require("chai")
const chaiAsPromised = require("chai-as-promised")
 
chai.use(chaiAsPromised)
const should = chai.should()


const randomGen = require('../common/random-gen')
const make = () => {
  const index = Math.floor(Math.random() * 255000)
  // console.log(index)
  return require('./user')(index, 'type')
}

describe('Api User', function() {
  describe('#createUser', function() {
    const M = make()
    const name = randomGen(40)
    const salt = randomGen(40)
    const hash = randomGen(40)

    it('should return true when we create a user', function() {
      return M.createUser(name,salt,hash).should.eventually.equal(true)
    })
    it('should return false when user already exist', function() {
      return M.createUser(name,salt,hash).should.eventually.equal(false)
    })
  })

  describe('#doesUserExist', function() {
    const M = make()
    const name = randomGen(40)
    const salt = randomGen(40)
    const hash = randomGen(40)

    it('should return false when user does not exist', function() {
      return M.doesUserExist(name).should.eventually.equal(false)
    })
    it('should return true when user does exist', function() {
      return M.createUser(name,salt,hash)
              .then(() =>  M.doesUserExist(name).should.eventually.equal(true))
    })
  })

  describe('#getUserSaltAndHash', function() {
    const M = make()
    const name = randomGen(40)
    const salt = randomGen(40)
    const hash = randomGen(40)

    it('should return null when user does exist', function() {
      return M.getUserSaltAndHash(name).should.eventually.deep.equal({salt:'',hash:''})
    })
    it('should return {salt,hash} when user exist', function() {
      return M.createUser(name,salt,hash)
              .then(() =>  M.getUserSaltAndHash(name).should.eventually.deep.equal({salt,hash}))
    })
  })
})
