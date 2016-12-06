const Sequelize = require('sequelize')
const sequelize = require('../helpers/db')

const Session = sequelize.define('Session', {
  id: { primaryKey: true, type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 },
  token: { type: Sequelize.STRING, allowNull: false }
}, {
  indexes: [
    { unique: true, fields: ['token'] },
    { fields: ['UserId'] }
  ]
})

module.exports = Session
