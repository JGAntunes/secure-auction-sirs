const Joi = require('joi')

function register (server, options = {}, next) {
  server.route({
    method: 'GET',
    path: '/users/new',
    config: {
      auth: false,
      handler: function (request, reply) {
        return reply.view('user/create.pug', {
          me: request.auth.credentials
        })
      }
    }
  })

  server.route({
    method: 'POST',
    path: '/users/new',
    config: {
      auth: false,
      validate: {
        payload: {
          name: Joi.string().description('name of the user').required(),
          email: Joi.string().email().description('email of the user').required(),
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
        params: {id: Joi.string().guid({
          version: [
            'uuidv4',
            'uuidv5'
          ]
        }).required()}
      },
      pre: [
        { method: 'user.get(params.id)', assign: 'user' },
        { method: function (request, reply) {
          const user = request.params.id
          server.methods.bid.list({user}, {item: true}, reply)
        }, assign: 'bids' }
      ],
      handler: function (request, reply) {
        return reply.view('user/view.pug', {
          me: request.auth.credentials,
          user: request.pre.user,
          bids: request.pre.bids
        })
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
