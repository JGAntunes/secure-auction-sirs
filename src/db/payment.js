const Sequelize = require('sequelize')
const sequelize = require('../helpers/db')

const Payment = sequelize.define('Payment', {
  id: { primaryKey: true, type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4 },
  code: { type: Sequelize.STRING, allowNull: false }
}, {
  indexes: [
    { unique: true, fields: ['code'] },
    { fields: ['BidId'] }
  ]
})

module.exports = Payment
