
const chai = require("chai")
const chaiHttp = require('chai-http')

chai.use(chaiHttp)
const expect = chai.expect

const tree = require('../common/tree')

const express = require('express')
const makeFs = require('./fs')
const makeApp = () => {
  const index = Math.floor(Math.random() * 255000)
  const fs = makeFs(index)
  return (account_name) => express().use(
    '/',
    (req, res, next) => {
      res.locals.payload = {
        account_name
      }
      next()
    },
    fs
  )
}

describe('Fs Routes', function() {

  describe('Post /:fs_id #create', function() {
    const app = makeApp()('swagy')
    const fs_id = Math.floor(Math.random() * 255000) 
    it('should return Created (201) when fs doesnot exist', function(done) {
      chai.request(app)
      .post('/'+fs_id)
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(201)
        done()
      })
    }).timeout(5000)

    it('should return Conflict (409) when fs already exist', function(done) {
      chai.request(app)
      .post('/'+fs_id)
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(409)
        done()
      })
    }).timeout(5000)

  })

  describe('Get /:fs_id #read', function() {
    const app = makeApp()
    const swagy_app = app('swagy')
    const fs_id = Math.floor(Math.random() * 255000)
    it('setup test env', function(done) {
      chai.request(swagy_app)
      .post('/'+fs_id)
      .end((err, res) => {
        expect(err).to.be.null
        done()
      })
    })

    it('should return Ok (200) when fs exist and is owner by the account', function(done) {
      chai.request(swagy_app)
      .get('/'+fs_id)
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res.body).to.deep.equal({
          owner:'swagy',
          tree:tree.init(fs_id)
        })
        done()
      })
    }).timeout(5000)

    it('should return Not Found (404) when fs does not exist', function(done) {
      chai.request(swagy_app)
      .get('/'+fs_id+'fzebjfkzebu')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(404)
        done()
      })
    }).timeout(5000)

    it('should return Not Found (404) when fs is not own by account', function(done) {
      chai.request(app('notSwagy'))
      .get('/'+fs_id)
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(404)
        done()
      })
    }).timeout(5000)

  })


  // describe('Post /:fs_id/* #push', function() {
  //   const app = makeApp()
  //   const swagy_app = app('swagy')
  //   const fs_id = Math.floor(Math.random() * 255000)
  //   it('setup test env', function(done) {
  //     chai.request(swagy_app)
  //     .post('/'+fs_id)
  //     .end((err, res) => {
  //       expect(err).to.be.null
  //       done()
  //     })
  //   })

  //   it('should return Ok (200) when fs exist', function(done) {
  //     chai.request(swagy_app)
  //     .post('/'+fs_id+'/test/path/us')
  //     .end((err, res) => {
  //       expect(err).to.be.null
  //       expect(res).to.have.status(200)
  //       done()
  //     })
  //   }).timeout(5000)

  // })

})