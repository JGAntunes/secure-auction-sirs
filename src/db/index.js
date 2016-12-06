const sequelize = require('../helpers/db')
const item = require('./item')
const user = require('./user')
const bid = require('./bid')
const salt = require('./salt')
const loginCode = require('./loginCode')
const session = require('./session')

item.belongsTo(user, {foreignKey: {allowNull: false}})
bid.belongsTo(user, {foreignKey: {allowNull: false}})
bid.belongsTo(item, {foreignKey: {allowNull: false}})

loginCode.belongsTo(user, {foreignKey: {allowNull: false}})
salt.belongsTo(user, {foreignKey: {allowNull: false}})
session.belongsTo(user, {foreignKey: {allowNull: false}})

// Don't drop tables if they already exist
sequelize.sync({force: false})

module.exports = {
  item,
  bid,
  user,
  salt
}
