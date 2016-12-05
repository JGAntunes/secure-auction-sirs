const Joi = require('joi')

function register (server, options = {}, next) {
  server.route({
    method: 'GET',
    path: '/login',
    config: {
      handler: function (request, reply) {
        return reply.view('misc/login.pug')
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/login/{code}',
    config: {
      validate: {
        params: {
          code: Joi.string().required()
        }
      },
      pre: [
        { method: 'login.validateCode(params.code)', assign: 'loginCode' },
        { method: function (request, reply) {
          console.log(request.pre.loginCode.UserId)
          const userId = request.pre.loginCode.UserId
          server.methods.user.get(userId, reply)
        }, assign: 'user' }
      ],
      handler: function (request, reply) {
        const userId = request.pre.user.id
        return reply().redirect(`/users/${userId}`)
      }
    }
  })

  server.route({
    method: 'POST',
    path: '/login',
    config: {
      validate: {
        payload: {
          email: Joi.string().email().required()
        }
      },
      pre: [
        { method: 'user.getByEmail(payload.email)', assign: 'user' },
        { method: 'login.createCode(pre.user.id)', assign: 'loginCode' },
        { method: function (request, reply) {
          const loginCode = request.pre.loginCode.code
          const user = request.pre.user
          server.methods.mail.send(loginCode, user, reply)
        }, assign: 'mail' }
      ],
      handler: function (request, reply) {
        return reply.view('misc/login-success.pug')
      }
    }
  })

  next()
}

register.attributes = {
  name: 'login',
  version: '1.0.0'
}

module.exports = register
