const sequelize = require('../helpers/db')
const item = require('./item')
const user = require('./user')
const bid = require('./bid')

item.belongsTo(user)
bid.belongsTo(user)
bid.belongsTo(item)

// Don't drop tables if they already exist
sequelize.sync({force: false})

module.exports = {
  item,
  bid,
  user
}
