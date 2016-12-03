const Bid = require('../methods/bid')
const Item = require('../methods/item')

// Plugin responsible for resgistering all the server methods
function register (server, options = {}, next) {
  Item(server)
  Bid(server)
  next()
}

register.attributes = {
  name: 'methods',
  version: '1.0.0'
}

module.exports = register
