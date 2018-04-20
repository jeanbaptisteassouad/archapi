const chai = require("chai")
const chaiAsPromised = require("chai-as-promised")
 
chai.use(chaiAsPromised)
const should = chai.should()


const randomGen = require('../common/random-gen')
const make = () => {
  const index = Math.floor(Math.random() * 255000)
  return require('./log')(index)
}

describe('Log Api', function() {
  describe('#create', function() {
    const M = make()

    const name = randomGen(40)
    const salt = randomGen(40)
    const hash = randomGen(40)

    it('should return true when we insert a new entry', function() {
      return M.create({name,salt,hash}).should.eventually.equal(true)
    })
  })

  describe('#readX', function() {
    const M = make()

    const name = randomGen(40)
    const salt = randomGen(40)
    const hash = randomGen(40)

    it('should return null when there is nothing to read', function() {
      return M.readX(10).should.eventually.equal(null)
    })

    it('should return null when we ask to read 0 entry', function() {
      return M.readX(0).should.eventually.equal(null)
    })

    it('should return at least x entry', function() {
      return M.create({name,salt,hash})
        .then(() => M.create({name,salt,hash}))
        .then(() => M.create({name,salt,hash}))
        .then(() => M.create({name,salt,hash}))
        .then(() => M.create({name,salt,hash}))
        .then(() => M.readX(10))
        .should.eventually.have.lengthOf(5)
    }).timeout(10000)

    it('should return exactly x entry', function() {
      return M.create({name,salt,hash})
        .then(() => M.create({name,salt,hash}))
        .then(() => M.create({name,salt,hash}))
        .then(() => M.create({name,salt,hash}))
        .then(() => M.create({name,salt,hash}))
        .then(() => M.readX(3))
        .should.eventually.have.lengthOf(3)
    }).timeout(10000)

  })
})