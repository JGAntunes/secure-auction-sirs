const Sequelize = require('sequelize')
const config = require('../../config')
const log = require('../helpers/logger')

const sequelize = new Sequelize(config.db, {logging: log.trace.bind(log)})

module.exports = sequelize
