'use strict'

const levelup = require('level')
const Joi = require('joi')
const crypto = require('crypto')

var userSchema = Joi.object().keys({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  details: Joi.object()
})

function Auth (conf) {
  this.db = levelup(conf.dbname)
}

function saveAuthUser (db, user, cb) {
  db.put(user.username, JSON.stringify(user), function (err) {
    cb(err)
  })
}

function getAuthUser (db, username, cb) {
  db.get(username, function (err, user) {
    if (err) return cb(err)
    cb(null, JSON.parse(user))
  })
}

Auth.prototype.generateHash = function (value) {
  let shasum = crypto.createHash('sha1')
  shasum.update(value)
  return shasum.digest('hex')
}

Auth.prototype.addUser = function (user, cb) {
  Joi.validate(user, userSchema, function (err) {
    if (err) return cb(err)
    getAuthUser(this.db, user.username, function (err) {
      if (!err || !err.notFound) return cb(new Error('User Already exist'))

      user = Object.assign({
        password: this.generateHash(user.password)
      }, user)
      saveAuthUser(this.db, user, cb)
    }.bind(this))
  }.bind(this))
}

Auth.prototype.authenticate = function (username, password, cb) {
  getAuthUser(this.db, username, function (err, user) {
    if (err) return cb(err)
    let hash = this.generateHash(password)
    if (hash === user.password) {
      cb()
    } else {
      cb(new Error('Password doesn\'t match'))
    }
  }.bind(this))
}

Auth.prototype.fetchDetails = function (username, cb) {
  getAuthUser(this.db, username, function (err, user) {
    if (err) return cb(err)
    cb(null, user.details)
  })
}

Auth.prototype.close = function (cb) {
  this.db.close(cb)
}

module.exports = function AuthBuilder (conf) {
  return new Auth(conf)
}
