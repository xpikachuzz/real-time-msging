const session = require("express-session")
const redisClient = require("../redis")
const {RedisStore} = require("connect-redis")
require("dotenv").config()

// Initialize store.
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
})

const sessionMiddleWare = session({
    secret: process.env.COOKIE_SECRET,
    credentials: true,
    name: "sid",
    resave: false,       // saves the session only if it changes
    saveUninitialized: false,
    store: redisStore,
    cookie: {
        secure: process.env.ENVIRONMENT==="production",
        httpOnly: true,
        sameSite: process.env.ENVIRONMENT==="production" ? "none" : "lax",   // will only be communicated between the same domain
    }
})

// Any express middlware we want to to use with socketio we just do
// wrap(the_middleware)
const wrap = (expressMiddleware) => (socket, next) => expressMiddleware(socket.request, {}, next)



const origin = "http://localhost:5173"
const corsConfi = { origin: "http://localhost:5173", credentials: true }


// NOW WE CAN USE THIS MULTIPLE TIMES
module.exports = {sessionMiddleWare, wrap, corsConfi}