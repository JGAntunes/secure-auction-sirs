const Sequelize = require('sequelize')
const sequelize = require('../helpers/db')

const Item = sequelize.define('Item', {
  id: { primaryKey: true, type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 },
  name: { type: Sequelize.STRING, allowNull: false },
  description: { type: Sequelize.STRING },
  img: { type: Sequelize.STRING, validate: {isUrl: true} },
  minValue: { type: Sequelize.FLOAT, allowNull: false },
  closed: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
  sentEmail: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }
}, {
  indexes: [
    { fields: ['UserId'] }
  ]
})

module.exports = Item
