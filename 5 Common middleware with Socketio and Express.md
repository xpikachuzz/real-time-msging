# Use the same session for express and socketio

usually the https requests is handled by the express app (`app.use` and middleware), the `app.use(session({...}))` handles the cookies and attaches it to `req.session` to be used later. 

However, when we use socketIO and get websocket requests (not http) they would go to the `io` application (e.g. `io.on()`), which doesn't have access to the `app.use(session({...}))` middleware so `io.on()` doesn't have access to the cookies.



```js

// original
...
app.use(session({
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
}))
...
io.on("connect", (socket) => {});

```

To share the session between the `socketio` and `express.app`. 
```js
// serverController.js

// Initialize store.
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
})

// so it can be used anywhere, multiple times
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

module.exports = {sessionMiddleWare, wrap}


// index.js
...
app.use(sessionMiddleWare)
...
io.use(wrap(sessionMiddleWare))
io.on("connect", (socket) => {
    console.log(socket.request.session.user)
});
...

```