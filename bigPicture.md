# Backend:
## Websocket server listen:
```js
const express = require("express");
const { Server } = require("socket.io");

const app = express();
const server = require("http").createServer(app);
// 1st arg is what our socketIO will be hosted on
// 2nd arg has cors
const io = new Server(server, {
    cors: { origin:"http://localhost:3000", credentials: true },
});
```

This is the same as doing `server.listen(3000, ...)` for accepting http requests. But this is for websockets to run on the express app.


## Sharing cookies & Redis:
```js
// index.js
// w/ this layout first it sets up the shared cookies, then...
io.use(wrap(sessionMiddleWare))


// serverController.js
const redisClient = require("../redis")
const {RedisStore} = require("connect-redis")

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
```
Normally, `app.use(sessionMiddleWare)` would apply session in the cookies, give access 
to `req.session`. The request is then shared with `socket.request.session` which is 
given as an argument. 


## Websocket 
```js
io.use(authorizeUser)

module.exports.authorizeUser = async (socket, next) => {
  // redisClient.FLUSHALL()
  try {
    if (!socket.request.session || !socket.request.session.user) {
      console.log("BAD REQUEST (authorizeUser)")
      // Errors emit "connect_error" type, which is listed to by the frontend
      next(new Error("Not authorized"))
    } else {
      socket.user = {
        ...socket.request.session.user
      }
      // goes into redis db and creates a js object
      // 1st argument is the key to the hashmap (like db)
      // 2nd & 3rd argument: key and value pair
      await redisClient.hSet("userid:"+socket.user.username, "userId", String(socket.user.userId))
      next()
    }
  } catch (e) {
    console.log("Redis Errror: ", e)
  }
}

```

When the user connects from the frontend they are authorized:
- they need to have a session (from cookies) and 