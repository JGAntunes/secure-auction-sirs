const Hapi = require('hapi')
const config = require('../config')
const server = new Hapi.Server({
  // Get error logs from the pug compiler
  debug: {
    request: ['error']
  }
})

server.connection({
  host: config.host,
  port: config.port
})

server.register([
  // Plugin to render views
  {register: require('vision')},
  // Plugin to serve static files
  {register: require('inert')}
], (err) => {
  if (err) throw err

  // Setup the pug view template engine
  server.views({
    engines: { pug: require('pug') },
    encoding: 'utf8',
    isCached: true,
    compileOptions: {
      pretty: true
    }
  })

  // Start the server
  server.start((err) => {
    if (err) throw err
    console.log(`Server running at: ${server.info.uri}`)
  })
})
