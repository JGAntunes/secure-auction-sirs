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
        return reply.view('item/list.pug', { items: request.pre.items })
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/items/new',
    config: {
      handler: function (request, reply) {
        return reply.view('item/create.pug')
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
          description: Joi.string().description('description of the item'),
          img: Joi.string().uri({
            scheme: [
              'http',
              'https'
            ]
          }).description('item image'),
          minValue: Joi.number().default(1)
        }
      },
      pre: [
        { method: 'item.create(payload)', assign: 'item' }
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
        params: {id: Joi.string().required()}
      },
      pre: [
        { method: 'item.get(params.id)', assign: 'item' }
      ],
      handler: function (request, reply) {
        return reply.view('item/view.pug', {item: request.pre.item})
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
