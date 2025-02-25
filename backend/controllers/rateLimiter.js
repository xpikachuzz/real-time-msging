const redisClient = require("../redis")

module.exports.rateLimiter = (secondLimit, limitAmount) => async (req, res, next) => {
  const ip = req.connection.remoteAddress

  // allows for multiple queries to the redisClient at the same time
  // in the database increment (`incr`) the ip if it exists, and is removed after 60 seconds (`expire`).
  // you `exec`ute this.

  const [responseCount, _] = await redisClient.multi().incr(ip).expire(ip, secondLimit).exec()
  if (responseCount > limitAmount ) {
    return res.json({
      loggedIn: false,
      status: "Slow down!! Try again later"
    })
  }

  next()
  // if the response is the ip was added, then 
}