
const Boom = require('boom')

function register (server, options = {}, next) {

  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      return reply.view('home.pug')
    }
  })

  server.route({
    method: 'GET',
    path: '/public/{p*}',
    handler: {
      directory: {
        path: '../public',
        redirectToSlash: true,
        index: true
      }
    }
  })

  next()
}

register.attributes = {
  name: 'views',
  version: '1.0.0'
}

module.exports = register
