const chai = require("chai")
const chaiAsPromised = require("chai-as-promised")
 
chai.use(chaiAsPromised)
const should = chai.should()


const randomGen = require('../common/random-gen')
const make = () => {
  const index = Math.floor(Math.random() * 255000)
  // console.log(index)
  return require('./fs')(index, 'type')
}

describe('Api Fs', function() {
  describe('#createFs', function() {
    const M = make()
    const id = randomGen(40)
    const owner = randomGen(40)

    it('should return true when we create a fs', function() {
      return M.createFs(owner,id).should.eventually.equal(true)
    })
    it('should return false when fs already exist', function() {
      return M.createFs(owner,id).should.eventually.equal(false)
    })
  })
})