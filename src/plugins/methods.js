const Bid = require('../methods/bid')
const Item = require('../methods/item')
const User = require('../methods/user')
const Login = require('../methods/login')
const Mail = require('../methods/mail')

// Plugin responsible for resgistering all the server methods
function register (server, options = {}, next) {
  Item(server)
  Bid(server)
  User(server)
  Login(server)
  Mail(server)
  next()
}

register.attributes = {
  name: 'methods',
  version: '1.0.0'
}

module.exports = register
