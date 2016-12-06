const config = require('../../config')

// Plugin responsible for registering and setting all the authorization methods
function register (server, options = {}, next) {
  server.auth.strategy('session', 'cookie', true, {
    password: config.sessions.password,
    cookie: config.sessions.cookie,
    redirectTo: config.sessions.redirectTo,
    isSecure: config.sessions.isSecure,
    // domain: config.sessions.isSecure,
    clearInvalid: true,
    keepAlive: false,
    isHttpOnly: true,
    validateFunc: function (request, session, callback) {
      server.methods.session.validate(session.userId, session.token, (err, session) => {
        if (err) return callback(err, false)
        if (!session) return callback(null, false)
        return callback(null, true, session)
      })
    }
  })
  next()
}

register.attributes = {
  name: 'auth',
  version: '1.0.0'
}

module.exports = register
