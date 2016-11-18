
const Hapi = require('hapi')
const config = require('../config')
const path = require('path')

const server = new Hapi.Server({
  // Get error logs from the pug compiler
  debug: {
    request: ['error']
  },
  // Set the relative file path to serve static files
  connections: {
    routes: {
      files: {
        relativeTo: path.join(__dirname, 'public')
      }
    }
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
  {register: require('inert')},
  // Register our plugins
  {register: require('./plugins/views')}
], (err) => {
  if (err) throw err

  // Setup the pug view template engine
  server.views({
    path: path.join(__dirname, './templates'),
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