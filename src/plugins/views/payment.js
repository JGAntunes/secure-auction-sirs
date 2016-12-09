const Joi = require('joi')

function register (server, options = {}, next) {
  server.route({
    method: 'GET',
    path: '/payments/{code}',
    config: {
      validate: {
        params: {code: Joi.string().required()}
      },
      handler: function (request, reply) {
        return reply.view('payment/payment.pug', {
          me: request.auth.credentials
        })
      }
    }
  })

  server.route({
    method: 'POST',
    path: '/payments/{code}',
    config: {
      validate: {
        params: {code: Joi.string().required()}
      },
      handler: function (request, reply) {
        return reply.view('payment/payment.pug', {
          me: request.auth.credentials
        })
      }
    }
  })

  next()
}

register.attributes = {
  name: 'payment',
  version: '1.0.0'
}

module.exports = register
