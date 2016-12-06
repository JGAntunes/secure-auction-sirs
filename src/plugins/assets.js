
function register (server, options = {}, next) {
  server.route({
    method: 'GET',
    path: '/public/{p*}',
    config: {
      auth: false,
      handler: {
        directory: {
          path: '../public',
          redirectToSlash: true,
          index: true
        }
      }
    }
  })

  next()
}

register.attributes = {
  name: 'assets',
  version: '1.0.0'
}

module.exports = register
