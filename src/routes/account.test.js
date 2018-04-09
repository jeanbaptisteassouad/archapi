
const chai = require("chai")
const chaiHttp = require('chai-http')

chai.use(chaiHttp)
const expect = chai.expect


const express = require('express')
const makeAccount = require('./account')
const makeApp = () => {
  const index = Math.floor(Math.random() * 255000)
  const app = express()
  app.use('/', makeAccount(index))
  return app
}


describe('Account Route', function() {

  describe('All /basic', function() {
    const allBasic = (it_string,auth,status) =>
      it(it_string, function(done) {
        chai.request(makeApp())
        .get('/basic')
        .set('Authorization', auth)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(status)
          done()
        })
      })


    it('should return Bad request (400) when no auth in header', function(done) {
      chai.request(makeApp())
      .post('/basic')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(400)
        done()
      })
    })

    allBasic(
      'should return Bad request (400) when auth is a bearer',
      'Bearer dXNlcjpwYXNz',
      400
    )

    allBasic(
      'should return Bad request (400) when auth is "Basic"',
      'Bearer',
      400
    )

    allBasic(
      'should return Bad request (400) when auth is "Basic xxx xxx"',
      'Basic dXNlcjpwYXNz dXNlcjpwYXNz',
      400
    )

    allBasic(
      'should return Bad request (400) when auth is "Basic base64(userpass)"',
      'Basic dXNlcnBhc3M=',
      400
    )

    allBasic(
      'should return Bad request (400) when auth is "Basic base64(user:pass:pass)"',
      'Basic dXNlcjpwYXNzOnBvc3M=',
      400
    )

    allBasic(
      'should return Bad request (400) when user is empty',
      'Basic '+Buffer.from(':pass').toString('base64'),
      400
    )

    allBasic(
      'should return Bad request (400) when password is empty',
      'Basic '+Buffer.from('user:').toString('base64'),
      400
    )

    allBasic(
      'should return Ok (200) when request pass all middleware',
      'Basic '+Buffer.from('user:pass').toString('base64'),
      200
    )
  })


  const createUser = (auth,app) =>
    chai.request(app)
    .post('/basic/account')
    .set('Authorization', 'Basic '+auth)

  const getToken = (auth,app) =>
    chai.request(app)
    .get('/basic/account')
    .set('Authorization', 'Basic '+auth)


  describe('Post /basic/account #createAccount', function() {
    const app = makeApp()

    it('should return Created (201) when request is successful', function(done) {
      createUser(Buffer.from('user:pass').toString('base64'),app)
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(201)
        done()
      })
    }).timeout(5000)

    it('should return Conflict (409) when user already exist', function(done) {
      createUser(Buffer.from('user:pass').toString('base64'),app)
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(409)
        done()
      })
    })
  })

  describe('Get /basic/account #getToken', function() {
    const app = makeApp()
    it('setup test env', function(done) {
      createUser(Buffer.from('user:pass').toString('base64'),app)
      .end((err, res) => {
        expect(err).to.be.null
        done()
      })
    }).timeout(5000)

    it('should return Ok (200) and the token when password match user', function(done) {
      getToken(Buffer.from('user:pass').toString('base64'),app)
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res.body.token.split('.').length).to.equal(3)
        done()
      })
    }).timeout(5000)

    it('should return Forbidden (403) and the token when password mismatch user', function(done) {
      getToken(Buffer.from('user:wrongpass').toString('base64'),app)
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(403)
        done()
      })
    }).timeout(5000)
  })

  describe('All /bearer', function() {
    const app = makeApp()
    let token

    it('setup test env', function(done) {
      const auth = Buffer.from('user:pass').toString('base64')
      createUser(auth,app)
      .end((err, res) => {
        expect(err).to.be.null
        getToken(auth,app)
        .end((err, res) => {
          expect(err).to.be.null
          token = res.body.token
          done()
        })
      })
    }).timeout(5000)

    const allBearer = (it_string,auth,status) =>
      it(it_string, function(done) {
        chai.request(app)
        .get('/bearer')
        .set('Authorization', auth())
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(status)
          done()
        })
      })

    it('should return Bad request (400) when no auth in header', function(done) {
      chai.request(app)
      .get('/bearer')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(400)
        done()
      })
    })

    allBearer(
      'should return Ok (200) when token is valid',
      ()=>'Bearer '+token,
      200
    )

    allBearer(
      'should return Bad request (400) when auth is not Bearer',
      ()=>'Basic '+token,
      400
    )

    allBearer(
      'should return Bad request (400) when auth is "Bearer xxx xxx"',
      ()=>'Bearer '+token+' '+token,
      400
    )

    allBearer(
      'should return Bad request (400) when auth is "Bearer "',
      ()=>'Bearer ',
      400
    )

    allBearer(
      'should return Bad Request (400) when token is invalid',
      ()=>'Bearer '+token+'fzenh',
      400
    )

    allBearer(
      'should return Ok (200) when token is valid',
      ()=>'Bearer '+token,
      200
    )


    // it('should return Forbidden (403) when token give access right to resource', function(done) {
    //   const app = makeApp()
    //   const auth = 'Basic '+Buffer.from('user:pass').toString('base64')
    //   createUser(auth,app)
    //   .end((err, res) => {
    //     expect(err).to.be.null
    //     getToken(auth,app)
    //     .end((err, res) => {
    //       expect(err).to.be.null
    //       const token = res.body.token
    //       chai.request(app)
    //       .get('/us/wronguser')
    //       .set('Authorization', 'Bearer '+token)
    //       .end((err, res) => {
    //         expect(err).to.be.null
    //         expect(res).to.have.status(403)
    //         done()
    //       })
    //     })
    //   })
    // }).timeout(5000)

  })

})