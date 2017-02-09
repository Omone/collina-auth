const assert = require('assert')

const AuthBuilder = require('../index.js')

describe('require library', function () {
  let auth
  let conf = {
    dbname: 'bar'
  }
  const user = {
    username: 'foo',
    secret: 'password',
    details: {
      a: 'b',
      c: 'd',
    },
  }

  beforeEach(function() {
    auth = AuthBuilder(conf)
  })
  afterEach(function (done) {
    require('leveldown').destroy(conf.dbname, done)
  })

  describe('should return an instance of auth', function () {
    it('API not empty', function () {
      assert.ok(auth)
      assert.ok(auth.addUser)
      assert.ok(auth.fetchDetails)
      assert.ok(auth.authenticate)
    })

    describe('Adding user', function () {
      it('should add an user', function (done) {
        auth.addUser(user, function(err, stored) {
          assert.ifError(err)

          delete stored.id
          assert.deepEqual(stored, user)
          done()
        })
      })

      it('should not add an existing user', function (done) {
        auth.addUser(user, function(err, stored) {
          auth.addUser(user, function(err) {
            assert.ok(err)
            done()
          })
        })
      })
    })


    describe('fetch Details', function () {
      it('should fetch details', function (done) {
        auth.addUser(user, function(err, stored) {
          auth.fetchDetails(user.username, function(err, details) {
            assert.ifError(err)

            assert.deepEqual(user.details, details)
            done()
          })
        })
      })

      it('should not fetch details if user unkonwn', function (done) {
        auth.fetchDetails(user.username, function(err, details) {
          assert.ok(err)
          done()
        })
      })
    })

    describe('authentication', function () {
      before(function () {
        const oldGenerateHash = auth.generateHash
        auth.generateHash = function(ddd) {
          return 'password'
        }
      })
      after(function (done) {
        auth.generateHash = oldGenerateHash
      })

      it('should authenticate if password is correct', function (done) {
        auth.addUser(user, function(err, stored) {
          auth.authenticate(user.username, 'password', function(err){
            assert.ifError(err)
            done()
          })
        })
      })

      it('should fail authentication if password is wrong', function (done) {
        auth.addUser(user, function(err, stored) {
          auth.authenticate(user.username, 'anotherOne', function(err){
            assert.ok(err)
            done()
          })
        })
      })

      it('should not authenticate an unknown user', function (done) {
        auth.authenticate(user.username, 'password', function(err){
          assert.ok(err)
          done()
        })
      })
    })
  })
})