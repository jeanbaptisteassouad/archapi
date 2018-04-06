
const chai = require("chai")
const chaiHttp = require('chai-http')

chai.use(chaiHttp)
const expect = chai.expect


const express = require('express')
const makeAccount = require('./account')
const makeApp = () => {
  const index = Math.floor(Math.random() * 255000)
  const app = express()
  app.use('/', makeAccount(index, 'type'))
  return app
}


describe('Routes Account', function() {
  const createUser = (auth,app) =>
    chai.request(app)
    .post('/')
    .set('Authorization', auth)

  const getToken = (auth,app) =>
    chai.request(app)
    .get('/')
    .set('Authorization', auth)

  const getResource = (auth,user_name,app) =>
    chai.request(app)
    .get('/us/'+user_name)
    .set('Authorization', auth)


  describe('#createUser', function() {
    
    const testRequest = (it_string,auth,status) =>
      it(it_string, function(done) {
        createUser(auth,makeApp())
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(status)
          done()
        })
      }).timeout(5000)

    it('should return Bad request (400) when no auth in header', function(done) {
      chai.request(makeApp())
      .post('/')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(400)
        done()
      })
    })

    testRequest(
      'should return Bad request (400) when auth is a bearer',
      'Bearer dXNlcjpwYXNz',
      400
    )

    testRequest(
      'should return Bad request (400) when auth is "Basic"',
      'Bearer',
      400
    )

    testRequest(
      'should return Bad request (400) when auth is "Basic xxx xxx"',
      'Basic dXNlcjpwYXNz dXNlcjpwYXNz',
      400
    )

    testRequest(
      'should return Bad request (400) when auth is "Basic base64(userpass)"',
      'Basic dXNlcnBhc3M=',
      400
    )

    testRequest(
      'should return Bad request (400) when auth is "Basic base64(user:pass:pass)"',
      'Basic dXNlcjpwYXNzOnBvc3M=',
      400
    )

    testRequest(
      'should return Bad request (400) when user is empty',
      'Basic '+Buffer.from(':pass').toString('base64'),
      400
    )

    testRequest(
      'should return Bad request (400) when password is empty',
      'Basic '+Buffer.from('user:').toString('base64'),
      400
    )

    testRequest(
      'should return Created (201) when request is successful',
      'Basic '+Buffer.from('user:pass').toString('base64'),
      201
    )


    it('should return Conflict (409) when user already exist', function(done) {
      const app = makeApp()
      createUser('Basic '+Buffer.from('user:pass').toString('base64'),app)
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(201)
        createUser('Basic '+Buffer.from('user:pass').toString('base64'),app)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(409)
          done()
        })
      })
    }).timeout(5000)

  })

  describe('#getToken', function() {
    const testRequest = (it_string,auth,status) =>
      it(it_string, function(done) {
        getToken(auth,makeApp())
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(status)
          done()
        }).timeout(5000)
      })

    it('should return Bad request (400) when no auth in header', function(done) {
      chai.request(makeApp())
      .get('/')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(400)
        done()
      })
    })

    testRequest(
      'should return Bad request (400) when auth is a bearer',
      'Bearer dXNlcjpwYXNz',
      400
    )

    testRequest(
      'should return Bad request (400) when auth is "Basic"',
      'Bearer',
      400
    )

    testRequest(
      'should return Bad request (400) when auth is "Basic xxx xxx"',
      'Basic dXNlcjpwYXNz dXNlcjpwYXNz',
      400
    )

    testRequest(
      'should return Bad request (400) when auth is "Basic base64(userpass)"',
      'Basic dXNlcnBhc3M=',
      400
    )

    testRequest(
      'should return Bad request (400) when auth is "Basic base64(user:pass:pass)"',
      'Basic dXNlcjpwYXNzOnBvc3M=',
      400
    )

    testRequest(
      'should return Bad request (400) when user is empty',
      'Basic '+Buffer.from(':pass').toString('base64'),
      400
    )

    testRequest(
      'should return Bad request (400) when password is empty',
      'Basic '+Buffer.from('user:').toString('base64'),
      400
    )

    testRequest(
      'should return Bad request (400) when user does not exist',
      'Basic '+Buffer.from('user:pass').toString('base64'),
      400
    )

    it('should return Ok (200) and the token when password match user', function(done) {
      const app = makeApp()
      createUser('Basic '+Buffer.from('user:pass').toString('base64'),app)
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(201)
        getToken('Basic '+Buffer.from('user:pass').toString('base64'),app)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(200)
          expect(res.body.token.split('.').length).to.equal(3)
          done()
        })
      })
    }).timeout(5000)

    it('should return Forbidden (403) and the token when password mismatch user', function(done) {
      const app = makeApp()
      createUser('Basic '+Buffer.from('user:pass').toString('base64'),app)
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(201)
        getToken('Basic '+Buffer.from('user:wrongpass').toString('base64'),app)
        .end((err, res) => {
          expect(err).to.be.null
          expect(res).to.have.status(403)
          done()
        })
      })
    }).timeout(5000)

  })


  describe('#getResource', function() {
    it('should return Bad request (400) when no auth in header', function(done) {
      const app = makeApp()
      const auth = 'Basic '+Buffer.from('user:pass').toString('base64')
      createUser(auth,app)
      .end((err, res) => {
        expect(err).to.be.null
        getToken(auth,app)
        .end((err, res) => {
          expect(err).to.be.null
          const token = res.body.token
          chai.request(app)
          .get('/us/user')
          // .set('Authorization', 'Bearer '+token)
          .end((err, res) => {
            expect(err).to.be.null
            expect(res).to.have.status(400)
            done()
          })
        })
      })
    }).timeout(5000)

    it('should return Bad request (400) when auth is not Bearer', function(done) {
      const app = makeApp()
      const auth = 'Basic '+Buffer.from('user:pass').toString('base64')
      createUser(auth,app)
      .end((err, res) => {
        expect(err).to.be.null
        getToken(auth,app)
        .end((err, res) => {
          expect(err).to.be.null
          const token = res.body.token
          chai.request(app)
          .get('/us/user')
          .set('Authorization', 'Basic '+token)
          .end((err, res) => {
            expect(err).to.be.null
            expect(res).to.have.status(400)
            done()
          })
        })
      })
    }).timeout(5000)


    it('should return Bad request (400) when auth is "Bearer xxx xxx"', function(done) {
      const app = makeApp()
      const auth = 'Basic '+Buffer.from('user:pass').toString('base64')
      createUser(auth,app)
      .end((err, res) => {
        expect(err).to.be.null
        getToken(auth,app)
        .end((err, res) => {
          expect(err).to.be.null
          const token = res.body.token
          chai.request(app)
          .get('/us/user')
          .set('Authorization', 'Bearer '+token+' '+token)
          .end((err, res) => {
            expect(err).to.be.null
            expect(res).to.have.status(400)
            done()
          })
        })
      })
    }).timeout(5000)


    it('should return Bad request (400) when auth is "Bearer "', function(done) {
      const app = makeApp()
      const auth = 'Basic '+Buffer.from('user:pass').toString('base64')
      createUser(auth,app)
      .end((err, res) => {
        expect(err).to.be.null
        getToken(auth,app)
        .end((err, res) => {
          expect(err).to.be.null
          const token = res.body.token
          chai.request(app)
          .get('/us/user')
          .set('Authorization', 'Bearer ')
          .end((err, res) => {
            expect(err).to.be.null
            expect(res).to.have.status(400)
            done()
          })
        })
      })
    }).timeout(5000)



    it('should return Ok (200) when token give access right to resource', function(done) {
      const app = makeApp()
      const auth = 'Basic '+Buffer.from('user:pass').toString('base64')
      createUser(auth,app)
      .end((err, res) => {
        expect(err).to.be.null
        getToken(auth,app)
        .end((err, res) => {
          expect(err).to.be.null
          const token = res.body.token
          chai.request(app)
          .get('/us/user')
          .set('Authorization', 'Bearer '+token)
          .end((err, res) => {
            expect(err).to.be.null
            expect(res).to.have.status(200)
            done()
          })
        })
      })
    }).timeout(5000)

    it('should return Forbidden (403) when token give access right to resource', function(done) {
      const app = makeApp()
      const auth = 'Basic '+Buffer.from('user:pass').toString('base64')
      createUser(auth,app)
      .end((err, res) => {
        expect(err).to.be.null
        getToken(auth,app)
        .end((err, res) => {
          expect(err).to.be.null
          const token = res.body.token
          chai.request(app)
          .get('/us/wronguser')
          .set('Authorization', 'Bearer '+token)
          .end((err, res) => {
            expect(err).to.be.null
            expect(res).to.have.status(403)
            done()
          })
        })
      })
    }).timeout(5000)

    it('should return Bad Request (400) when token is bad formated', function(done) {
      const app = makeApp()
      const auth = 'Basic '+Buffer.from('user:pass').toString('base64')
      createUser(auth,app)
      .end((err, res) => {
        expect(err).to.be.null
        getToken(auth,app)
        .end((err, res) => {
          expect(err).to.be.null
          const token = res.body.token
          chai.request(app)
          .get('/us/user')
          .set('Authorization', 'Bearer '+token+'fzenh')
          .end((err, res) => {
            expect(err).to.be.null
            expect(res).to.have.status(400)
            done()
          })
        })
      })
    }).timeout(5000)
  })


  describe('#createFs', function() {
    it('should return Created (201) when fs doesnot exist', function(done) {
      const app = makeApp()
      const auth = 'Basic '+Buffer.from('user:pass').toString('base64')
      const fs_id = Math.floor(Math.random() * 255000)
      createUser(auth,app)
      .end((err, res) => {
        expect(err).to.be.null
        getToken(auth,app)
        .end((err, res) => {
          expect(err).to.be.null
          const token = res.body.token
          chai.request(app)
          .post('/fs/'+fs_id)
          .set('Authorization', 'Bearer '+token)
          .end((err, res) => {
            expect(err).to.be.null
            expect(res).to.have.status(201)
            done()
          })
        })
      })
    }).timeout(10000)


    it('should return Conflict (409) when fs already exist', function(done) {
      const app = makeApp()
      const auth = 'Basic '+Buffer.from('user:pass').toString('base64')
      const fs_id = Math.floor(Math.random() * 255000)
      createUser(auth,app)
      .end((err, res) => {
        expect(err).to.be.null
        getToken(auth,app)
        .end((err, res) => {
          expect(err).to.be.null
          const token = res.body.token
          chai.request(app)
          .post('/fs/'+fs_id)
          .set('Authorization', 'Bearer '+token)
          .end((err, res) => {
            expect(err).to.be.null
            chai.request(app)
            .post('/fs/'+fs_id)
            .set('Authorization', 'Bearer '+token)
            .end((err, res) => {
              expect(err).to.be.null
              expect(res).to.have.status(409)
              done()
            })
          })
        })
      })
    }).timeout(10000)

  })
})