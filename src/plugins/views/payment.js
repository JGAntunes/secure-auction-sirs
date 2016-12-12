const Joi = require('joi')

function register (server, options = {}, next) {
  server.route({
    method: 'GET',
    path: '/payments/{code}',
    config: {
      validate: {
        params: {code: Joi.string().required()}
      },
      pre: [
        { method: 'payment.validate(auth.credentials.UserId, params.code)', assign: 'payment' }
      ],
      handler: function (request, reply) {
        return reply.view('payment/view.pug', {
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
        params: {code: Joi.string().required()},
        payload: {
          num: Joi.string().creditCard().required(),
          cvv: Joi.string().max(3).required(),
          expDate: Joi.date().min((new Date()).setMonth(new Date().getMonth() - 1)).required(),
          name: Joi.string().required()
        }
      },
      pre: [
        // Mock some special payment request to a 3rd party service,
        { method: 'payment.validate(auth.credentials.UserId, params.code)', assign: 'payment' },
        { method: 'payment.remove(params.code)', assign: 'deletedPayment' }
      ],
      handler: function (request, reply) {
        return reply.view('payment/view.pug', {
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
