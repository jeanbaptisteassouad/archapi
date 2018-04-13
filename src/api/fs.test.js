const chai = require("chai")
const chaiAsPromised = require("chai-as-promised")

chai.use(chaiAsPromised)
const should = chai.should()



const tree = require('../common/tree')
const randomGen = require('../common/random-gen')
const make = () => {
  const index = Math.floor(Math.random() * 255000)
  return require('./fs')(index)
}

describe('Fs Api', function() {
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
              .then(() => M.read(id).should.eventually.deep.equal({
                owner,
                tree:tree.init(id)
              }))
    })
  })

  describe('#push', function() {
    const M = make()
    const id = randomGen(40)
    const owner = randomGen(40)

    const makeArrOfPath = (num) => {
      const arr = []
      for (let i = 0; i < num; i++) {
        const path = []
        for (let j = 0; j < 1+Math.floor(Math.random() * 8); j++) {
          path.push(''+Math.floor(Math.random() * 20))
        }
        arr.push(path)
      }
      return arr
    }

    const makeTreeWithAOP = (id,size,aop) => {
      const t = tree.init(id)
      aop.forEach(path => tree.update([id].concat(path),size,t))
      return t
    }


    const path = ['baba','coco']
    const size = 1203
    // const t = tree.init(id)
    // tree.update([id].concat(path),size,t)

    const t = makeTreeWithAOP(id,size,[path])

    it('should return false when fs does not exist', function() {
      return M.push(path,size,id).should.eventually.equal(false)
    })
    it('should return true when it exist', function() {
      return M.create(owner,id)
              .then(() => M.push(path,size,id).should.eventually.equal(true))
              .then(() => M.read(id).should.eventually.deep.equal({
                owner,
                tree:t
              }))
    }).timeout(5000)


    // it('should handle multiple parallel requests', function() {
    //   const aop = makeArrOfPath(10)
    //   const size = 1
    //   const id = randomGen(40)
    //   const t = makeTreeWithAOP(id,size,aop)

    //   return M.create(owner,id)
    //           // .then(() => M.push(path,size,id).should.eventually.equal(true))
    //           .then(() => Promise.all(aop.map(path => M.push(path,size,id).should.eventually.equal(true))))
    //           .then(() => M.read(id).should.eventually.deep.equal({
    //             owner,
    //             tree:t
    //           }))
    // }).timeout(5000)


  })
})