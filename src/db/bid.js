const Sequelize = require('sequelize')
const sequelize = require('../helpers/db')

const Bid = sequelize.define('Bid', {
  id: { primaryKey: true, type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 },
  value: { type: Sequelize.FLOAT, allowNull: false }
})

module.exports = Bid
