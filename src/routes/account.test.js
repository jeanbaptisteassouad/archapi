
const chai = require("chai")
const chaiHttp = require('chai-http')

chai.use(chaiHttp)
const expect = chai.expect


const express = require('express')
const account = require('./account')
const app = express()
app.use('/', account)


const promify = a => new Promise((resolve, reject) => {
  a.then(() => resolve())
})

describe('Routes Account', function() {
  describe('#createUser', function() {

    it('should return Bad request (400) when no auth in header', function(done) {
      chai.request(app)
      .post('/')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(400)
        done()
      })
    })


    it('should return Bad request (400) when auth is a bearer', function(done) {
      chai.request(app)
      .post('/')
      .set('Authorization', 'Bearer dXNlcjpwYXNz')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(400)
        done()
      })
    })

    it('should return Bad request (400) when auth is "Basic"', function(done) {
      chai.request(app)
      .post('/')
      .set('Authorization', 'Basic')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(400)
        done()
      })
    })

    it('should return Bad request (400) when auth is "Basic xxx xxx"', function(done) {
      chai.request(app)
      .post('/')
      .set('Authorization', 'Basic dXNlcjpwYXNz dXNlcjpwYXNz')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(400)
        done()
      })
    })


    it('should return Bad request (400) when auth is "Basic base64(userpass)"', function(done) {
      chai.request(app)
      .post('/')
      .set('Authorization', 'Basic dXNlcnBhc3M=')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(400)
        done()
      })
    })

    it('should return Bad request (400) when auth is "Basic base64(user:pass:pass)"', function(done) {
      chai.request(app)
      .post('/')
      .set('Authorization', 'Basic dXNlcjpwYXNzOnBvc3M=')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(400)
        done()
      })
    })


  })
})