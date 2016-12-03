const Sequelize = require('sequelize')
const sequelize = require('../helpers/db')

const User = sequelize.define('User', {
  id: { primaryKey: true, type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 },
  name: { type: Sequelize.STRING, allowNull: false },
  email: { type: Sequelize.STRING, allowNull: false, validate: { isEmail: true } },
  img: { type: Sequelize.STRING, allowNull: false, validate: {isUrl: true} }
}, {
  indexes: [
    { unique: true, fields: ['email'] }
  ]
})

module.exports = User
