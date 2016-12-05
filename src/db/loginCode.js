const Sequelize = require('sequelize')
const sequelize = require('../helpers/db')

const LoginCode = sequelize.define('LoginCode', {
  id: { primaryKey: true, type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 },
  code: { type: Sequelize.STRING, allowNull: false }
}, {
  indexes: [
    { unique: true, fields: ['code'] },
    { fields: ['UserId'] }
  ]
})

module.exports = LoginCode
