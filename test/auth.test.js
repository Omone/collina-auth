/* eslint-env mocha */
const assert = require('assert')

const AuthBuilder = require('../index.js')
let oldGenerateHash

var fs = require('fs')
var deleteFolderRecursive = function (path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + '/' + file
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath)
      } else { // delete file
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}

describe('require library', function () {
  let auth
  let conf = {
    dbname: 'bar'
  }
  const user = {
    username: 'foo',
    password: 'password',
    details: {
      a: 'b',
      c: 'd'
    }
  }

  beforeEach(function () {
    auth = AuthBuilder(conf)
    oldGenerateHash = auth.generateHash
  })
  afterEach(function (done) {
    auth.close(function () {
      deleteFolderRecursive(require('path').join(__dirname, '/../bar'))
      done()
    })
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
        auth.addUser(user, function (err) {
          assert.ifError(err)
          done()
        })
      })

      it('should not add an existing user', function (done) {
        auth.addUser(user, function (err) {
          assert.ifError(err)
          auth.addUser(user, function (err) {
            assert.ok(err)
            done()
          })
        })
      })
    })

    describe('fetch Details', function () {
      it('should fetch details', function (done) {
        auth.addUser(user, function () {
          auth.fetchDetails(user.username, function (err, details) {
            assert.ifError(err)

            assert.deepEqual(user.details, details)
            done()
          })
        })
      })

      it('should not fetch details if user unkonwn', function (done) {
        auth.fetchDetails('aaaa', function (err, details) {
          assert.ok(err)
          done()
        })
      })
    })

    describe('authentication', function () {
      beforeEach(function () {
        auth.generateHash = function () {
          return 'password'
        }
      })
      afterEach(function () {
        auth.generateHash = oldGenerateHash
      })

      it('should authenticate if password is correct', function (done) {
        auth.addUser(user, function (err, stored) {
          assert.ifError(err)
          auth.authenticate(user.username, 'password', function (err) {
            assert.ifError(err)
            done()
          })
        })
      })

      it('should fail authentication if password is wrong', function (done) {
        auth.generateHash = oldGenerateHash
        auth.addUser(user, function (err, stored) {
          assert.ifError(err)
          auth.authenticate(user.username, 'anotherOne', function (err) {
            assert.ok(err)
            done()
          })
        })
      })

      it('should not authenticate an unknown user', function (done) {
        auth.authenticate(user.username, 'password', function (err) {
          assert.ok(err)
          done()
        })
      })
    })
  })
})
