use 'strict';

const levelup = require('levelup')
const joi = require('joi')


var user_schema = Joi.object().keys({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  details: Joi.object()
});

function Auth(conf) {
  this.db = levelup(conf.dbname)

}



Auth.prototype.addUser = function (user, cb) {
  joi.validate(user, user_schema, cb);

}


module.exports = function AuthBuilder(conf) {
  return new Auth();
}



