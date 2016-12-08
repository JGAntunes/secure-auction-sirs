const Joi = require('joi')

server.route({
  method: 'GET',
  path: '/payment/{paycode}',
  config: {
    validate: {
      params: {paycode: Joi.string().required()}
    },
    handler: function (request, reply) {
      return reply.view('payment/payment.pug', {
        me: request.auth.credentials
      })
    }
  }
})
