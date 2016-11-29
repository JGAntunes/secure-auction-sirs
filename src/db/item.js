const Sequelize = require('sequelize')
const sequelize = require('../helpers/db')

const Item = sequelize.define('Item', {
  id: { primaryKey: true, type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 },
  name: { type: Sequelize.STRING },
  description: { type: Sequelize.STRING },
  img: { type: Sequelize.STRING },
  minValue: { type: Sequelize.FLOAT }
})

module.exports = Item
