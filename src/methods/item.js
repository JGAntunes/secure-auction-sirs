const Boom = require('boom')
const log = require('../helpers/logger')
const Item = require('../db/item')

// Exported function responsible for registering the server methods
function register (server) {
  server.method('item.update', update)
  server.method('item.create', create)
  server.method('item.get', get)
  server.method('item.list', list)
}

module.exports = register

function update (itemId, newItem, callback) {
  Item.update(newItem, { where: {id: itemId}, return: true })
  .then(([affectedCount, affectedRows]) => {
    return affectedCount > 0
    ? callback(null, affectedRows[0].toJSON())
    : callback(Boom.notFound('item not found'))
  })
  .catch((err) => {
    log.error({ err: err }, 'error updating item')
    callback(Boom.internal())
  })
}

function create (item, callback) {
  Item.create(item)
  .then(result => callback(null, result.toJSON()))
  .catch((err) => {
    log.error({ err: err }, 'error creating item')
    callback(Boom.internal())
  })
}

function get (itemId, callback) {
  Item.findById(itemId)
  .then((result) => {
    return result
      ? callback(null, result.toJSON())
      : callback(Boom.notFound('item not found'))
  })
  .catch((err) => {
    log.error({ err: err }, 'error getting item')
    callback(Boom.internal())
  })
}

function list (callback) {
  Item.findAll()
  .then(result => callback(null, result))
  .catch((err) => {
    log.error({ err: err }, 'error getting item')
    callback(Boom.internal())
  })
}
