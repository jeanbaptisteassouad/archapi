const chai = require("chai")
const chaiAsPromised = require("chai-as-promised")
 
chai.use(chaiAsPromised)
const should = chai.should()


const randomGen = require('../common/random-gen')
const make = () => {
  const index = Math.floor(Math.random() * 255000)
  return require('./account')(index)
}

describe('Account Api', function() {
  describe('#create', function() {
    const M = make()
    // it('', () => make().then(m=>M=m))

    const name = randomGen(40)
    const salt = randomGen(40)
    const hash = randomGen(40)

    it('should return true when we create a user', function() {
      return M.create(name,salt,hash).should.eventually.equal(true)
    })
    it('should return false when user already exist', function() {
      return M.create(name,salt,hash).should.eventually.equal(false)
    })
  })

  describe('#exist', function() {
    const M = make()
    // it('', () => make().then(m=>M=m))

    const name = randomGen(40)
    const salt = randomGen(40)
    const hash = randomGen(40)

    it('should return false when user does not exist', function() {
      return M.exist(name).should.eventually.equal(false)
    })
    it('should return true when user does exist', function() {
      return M.create(name,salt,hash)
              .then(() =>  M.exist(name).should.eventually.equal(true))
    })
  })

  describe('#saltAndHash', function() {
    const M = make()
    // it('', () => make().then(m=>M=m))
    
    const name = randomGen(40)
    const salt = randomGen(40)
    const hash = randomGen(40)

    it('should return {salt:"",hash:""} when user does not exist', function() {
      return M.saltAndHash(name).should.eventually.deep.equal({salt:'',hash:''})
    })
    it('should return {salt,hash} when user exist', function() {
      return M.create(name,salt,hash)
              .then(() =>  M.saltAndHash(name).should.eventually.deep.equal({salt,hash}))
    })
  })

})
