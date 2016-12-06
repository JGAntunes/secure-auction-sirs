const Joi = require('joi')

function register (server, options = {}, next) {
  server.route({
    method: 'GET',
    path: '/login',
    config: {
      auth: false,
      handler: function (request, reply) {
        return reply.view('misc/login.pug', {
          me: request.auth.credentials
        })
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/login/{code}',
    config: {
      auth: false,
      validate: {
        params: {
          code: Joi.string().required()
        }
      },
      pre: [
        { method: 'login.validateCode(params.code)', assign: 'loginCode' },
        { method: function (request, reply) {
          const userId = request.pre.loginCode.UserId
          server.methods.user.get(userId, reply)
        }, assign: 'user' },
        { method: 'session.create(pre.user.id)', assign: 'session'}
      ],
      handler: function (request, reply) {
        const userId = request.pre.user.id
        const token = request.pre.session.token
        request.cookieAuth.set({
          userId: userId,
          token: token
        })
        return reply().redirect(`/users/${userId}`)
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/logout',
    config: {
      pre: [
        { method: 'session.remove(auth.credentials.UserId, auth.credentials.token)' }
      ],
      handler: function (request, reply) {
        request.cookieAuth.clear()
        return reply().redirect('/login')
      }
    }
  })

  server.route({
    method: 'POST',
    path: '/login',
    config: {
      auth: false,
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
        return reply.view('misc/login-success.pug', {
          me: request.auth.credentials
        })
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
