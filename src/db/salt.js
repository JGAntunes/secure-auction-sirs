const Sequelize = require('sequelize')
const sequelize = require('../helpers/db')

const Salt = sequelize.define('Salt', {
  id: { primaryKey: true, type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 },
  salt: { type: Sequelize.STRING, allowNull: false }
},{
  indexes: [
    { unique: true, fields: ['UserId'] }
  ]
})

module.exports = Salt