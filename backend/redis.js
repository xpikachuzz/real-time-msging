const redis = require("redis")
const Redis = require('ioredis')
const { createClient } = require('redis')

const redisClient = new createClient()



module.exports = redisClient