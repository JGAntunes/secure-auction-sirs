const Boom = require('boom')
const log = require('../helpers/logger')
const User = require('../db/user')

// Exported function responsible for registering the server methods
function register (server) {
  server.method('user.update', update)
  server.method('user.create', create)
  server.method('user.get', get)
  server.method('user.getByEmail', getByEmail)
  server.method('user.list', list)
}

module.exports = register

function update (userId, newUser, callback) {
  User.update(newUser, { where: {id: userId}, returning: true })
  .then(([affectedCount, affectedRows]) => {
    return affectedCount > 0
    ? callback(null, affectedRows[0].toJSON())
    : callback(Boom.notFound('user not found'))
  })
  .catch((err) => {
    log.error(err, 'error updating user')
    callback(Boom.internal())
  })
}

function create (user, callback) {
  User.create(user)
  .then(result => callback(null, result.toJSON()))
  .catch((err) => {
    log.error(err, 'error creating user')
    callback(Boom.internal())
  })
}

function get (userId, callback) {
  User.findById(userId)
  .then((result) => {
    return result
      ? callback(null, result.toJSON())
      : callback(Boom.notFound('user not found'))
  })
  .catch((err) => {
    log.error(err, 'error getting user')
    callback(Boom.internal())
  })
}

function getByEmail (userEmail, callback) {
  User.findOne({ where: {email: userEmail} })
  .then((result) => {
    return result
      ? callback(null, result.toJSON())
      : callback(Boom.notFound('user not found'))
  })
  .catch((err) => {
    log.error(err, 'error getting user')
    callback(Boom.internal())
  })
}

function list (callback) {
  User.findAll()
  .then(result => callback(null, result))
  .catch((err) => {
    log.error(err, 'error getting user')
    callback(Boom.internal())
  })
}
