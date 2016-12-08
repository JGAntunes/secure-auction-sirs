const Joi = require('joi')

function register (server, options = {}, next) {
  server.route({
    method: 'GET',
    path: '/',
    config: {
      pre: [
        { method: 'item.list()', assign: 'items' }
      ],
      handler: function (request, reply) {
        return reply.view('item/list.pug', {
          me: request.auth.credentials,
          items: request.pre.items
        })
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/items/new',
    config: {
      handler: function (request, reply) {
        return reply.view('item/create.pug', {
          me: request.auth.credentials
        })
      }
    }
  })

  server.route({
    method: 'POST',
    path: '/items/new',
    config: {
      validate: {
        payload: {
          name: Joi.string().description('name of the item').required(),
          description: Joi.string().description('description of the item').required(),
          img: Joi.string().uri({
            scheme: [
              'http',
              'https'
            ]
          }).description('item image'),
          minValue: Joi.number().default(1).required()
        }
      },
      pre: [
        { method: function (request, reply){
          const userId = request.auth.credentials.UserId
          const newItem = Object.assign({}, request.payload, {UserId: userId})
          server.methods.item.create(newItem, reply)
        }, assign: 'item' }
      ],
      handler: function (request, reply) {
        const item = request.pre.item
        return reply.redirect(`/items/${item.id}`)
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/items/{id}',
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
        { method: 'item.get(params.id)', assign: 'item' },
        { method: function (request, reply) {
          const item = request.params.id
          server.methods.bid.list({item}, {user: true}, reply)
        }, assign: 'bids' }
      ],
      handler: function (request, reply) {
        return reply.view('item/view.pug', {
          me: request.auth.credentials,
          item: request.pre.item,
          bids: request.pre.bids
        })
      }
    }
  })

  server.route({
    method: 'POST',
    path: '/items/{id}/bid',
    config: {
      validate: {
        params: {id: Joi.string().guid({
          version: [
            'uuidv4',
            'uuidv5'
          ]
        }).required()},
        payload: {
          value: Joi.number().positive().required()
        }
      },
      pre: [
        { method: function (request, reply) {
          server.methods.bid.create({
            // TODO replace this hardcoded UUID
            UserId: request.auth.credentials.UserId,
            ItemId: request.params.id,
            value: request.payload.value
          }, reply)
        }, assign: 'bid' }
      ],
      handler: function (request, reply) {
        const item = request.params.id
        return reply.redirect(`/items/${item}`)
      }
    }
  })

  next()
}

register.attributes = {
  name: 'item',
  version: '1.0.0'
}

module.exports = register
