
function register (server, options = {}, next) {

  const preResponse = function (request, reply) {
    const response = request.response
    if (!response.isBoom) return reply.continue()

    // Replace error with friendly HTML

    const error = response
    const message = (error.output.statusCode === 404)
        ? 'Page Not Found'
        : 'Something went wrong, please verify you\'ve submitted all your data correctly'

    return reply.view('misc/error.pug', { message })
  }

  server.ext('onPreResponse', preResponse)

  next()
}

register.attributes = {
  name: 'error',
  version: '1.0.0'
}

module.exports = register
