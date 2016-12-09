const log = require('../helpers/logger')
const series = require('async/series')
const waterfall = require('async/waterfall')
const each = require('async/each')

// This is an hack to avoid adding another layer of persistency to the project
// ideally this would be something by something capable of triggering time based
// events

function register (server, options = {}, next) {
  setInterval(() => {
    series([
      cb => server.methods.item.closeExpired(cb),
      cb => server.methods.item.getWinners(cb)
    ], (err, results) => {
      const winnerBids = results[1]
      if (err) {
        log.error(err)
        return
      }
      each(winnerBids, (winnerBid, cb) => {
        waterfall([
          cb => server.methods.bid.getByValue(winnerBid.id, winnerBid.max, cb),
          (bid, cb) => server.methods.payment.create(bid.id, (err, payment) => {
            if (err) return cb(err)
            cb(null, payment, bid)
          }),
          (payment, bid, cb) => {
            server.methods.mail.send.payment(payment.code, bid.Item, bid.User, cb)
          },
          (payment, cb) => server.methods.item.update(winnerBid.id, {sentEmail: true}, cb)
        ], cb)
      }, (err, results) => { if (err) log.debug(err) })
    })
  }, 30 * 1000)

  next()
}

register.attributes = {
  name: 'item-cron',
  version: '1.0.0'
}

module.exports = register
