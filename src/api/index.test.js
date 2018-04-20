const chai = require("chai")
const chaiAsPromised = require("chai-as-promised")
 
chai.use(chaiAsPromised)
const should = chai.should()

const index = require('./index')

const randomGen = require('../common/random-gen')


describe('Index Api', function() {
  describe('#create', function() {
    const name = Math.floor(Math.random() * 255000)
    const properties = {
      name: { "type" : "keyword" },
      salt: { "type" : "keyword" },
      hash: { "type" : "keyword" },
    }

    it('should return true when we create an index', function() {
      return index.create(properties,name).should.eventually.equal(true)
    })

    it('should return false when index already exist', function() {
      return index.create(properties,name).should.eventually.equal(false)
    })
  })

  describe('#exist', function() {
    const name = Math.floor(Math.random() * 255000)
    const properties = {
      name: { "type" : "keyword" },
      salt: { "type" : "keyword" },
      hash: { "type" : "keyword" },
    }

    it('should return false when we create an index', function() {
      return index.exists(name).should.eventually.equal(false)
    })

    it('should return true when index already exist', function() {
      return index.create(properties,name)
        .then(() => index.exists(name).should.eventually.equal(true))
    })

  })


  describe('#checkProps', function() {
    const name = Math.floor(Math.random() * 255000)

    const properties = {
      name: { "type" : "keyword" },
      salt: { "type" : "keyword" },
      hash: { "type" : "keyword" },
    }

    const bad_properties = {
      name: { "type" : "keyword" },
    }

    it('should return true when index has the same props', function() {
      return index.create(properties,name)
        .then(() => index.checkProps(properties,name).should.eventually.equal(true))
    })

    it('should return false when index does not have the same props', function() {
      return index.checkProps(bad_properties,name).should.eventually.equal(false)
    })

  })


  describe('#ensure', function() {
    const name = Math.floor(Math.random() * 255000)
    const properties = {
      name: { "type" : "keyword" },
      salt: { "type" : "keyword" },
      hash: { "type" : "keyword" },
    }

    const bad_properties = {
      name: { "type" : "keyword" },
    }

    it('should return null when it creates the index', function() {
      return index.ensure(properties,name).should.eventually.equal(null)
    })

    it('should return null when index exists with the same props', function() {
      return index.ensure(properties,name).should.eventually.equal(null)
    })
    it('should throw when index exists without the same props', function(done) {
      index.ensure(bad_properties,name).catch(err => {
        done()
      })
    })

  })

})