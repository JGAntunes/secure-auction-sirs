const sequelize = require('../helpers/db')
const item = require('./item')
const user = require('./user')
const bid = require('./bid')
const loginCode = require('./loginCode')
const session = require('./session')
const payment = require('./payment')

item.belongsTo(user, {foreignKey: {allowNull: false}})
bid.belongsTo(user, {foreignKey: {allowNull: false}})
bid.belongsTo(item, {foreignKey: {allowNull: false}})

loginCode.belongsTo(user, {foreignKey: {allowNull: false}})
session.belongsTo(user, {foreignKey: {allowNull: false}})
payment.belongsTo(bid, {foreignKey: {allowNull: false}})

// Don't drop tables if they already exist
sequelize.sync({force: false})

module.exports = {
  item,
  bid,
  user,
  payment
}
