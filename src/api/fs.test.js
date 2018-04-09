const chai = require("chai")
const chaiAsPromised = require("chai-as-promised")
 
chai.use(chaiAsPromised)
const should = chai.should()


const randomGen = require('../common/random-gen')
const make = () => {
  const index = Math.floor(Math.random() * 255000)
  return require('./fs')(index)
}

describe('Api Fs', function() {
  describe('#create', function() {
    const M = make()
    const id = randomGen(40)
    const owner = randomGen(40)

    it('should return true when we create a fs', function() {
      return M.create(owner,id).should.eventually.equal(true)
    })
    it('should return false when fs already exist', function() {
      return M.create(owner,id).should.eventually.equal(false)
    })
  })

  describe('#read', function() {
    const M = make()
    const id = randomGen(40)
    const owner = randomGen(40)

    it('should return null when fs does not exist', function() {
      return M.read(id).should.eventually.equal(null)
    })
    it('should return fs when it exist', function() {
      return M.create(owner,id)
              .then(() => M.read(id).should.eventually.deep.equal({owner}))
    })
  })
})