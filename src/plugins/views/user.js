const Joi = require('joi')

function register (server, options = {}, next) {
  server.route({
    method: 'GET',
    path: '/users/new',
    config: {
      handler: function (request, reply) {
        return reply.view('user/create.pug')
      }
    }
  })

  server.route({
    method: 'POST',
    path: '/users/new',
    config: {
      validate: {
        payload: {
          name: Joi.string().description('name of the user').required(),
          email: Joi.string().email().description('email of the user'),
          img: Joi.string().uri({
            scheme: [
              'http',
              'https'
            ]
          }).description('user image')
        }
      },
      pre: [
        { method: 'user.create(payload)', assign: 'user' }
      ],
      handler: function (request, reply) {
        const user = request.pre.user
        return reply.redirect(`/users/${user.id}`)
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/users/{id}',
    config: {
      validate: {
        params: {id: Joi.string().required()}
      },
      pre: [
        { method: 'user.get(params.id)', assign: 'user' }
      ],
      handler: function (request, reply) {
        return reply.view('user/view.pug', {user: request.pre.user})
      }
    }
  })

  next()
}

register.attributes = {
  name: 'user',
  version: '1.0.0'
}

module.exports = register
