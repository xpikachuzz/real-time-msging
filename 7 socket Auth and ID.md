# Authoirzation:

```js
// socketController.js
module.exports.authorizeUser = (socket, next) => {
  if (!socket.request.session || !socket.request.session.user) {
    console.log("BAD REQUEST (authorizeUser)")
    // Errors emit "connect_error" type, which is listed to by the frontend
    next(new Error("Not authorized"))
  } else {
    next()
  }
}

// index.js
...
// w/ this layout first it sets up the shared cookies, then...
io.use(wrap(sessionMiddleWare))
// check if the user is authorized.
io.use(authorizeUser)
// then runs the server.j
io.on("connect", (socket) => {
    console.log("SUCK IT", socket.request.session.user)
});
...

```



# Persistent ID
When you refresh your `socket.id` (inside `io.on`) changes, this is bad because if you want to talk to friends it would be easier to manage if a user keeps the same id.

Install in server: `npm i uuid`.

Steps: 
1. First give "Users" db a unique `userId` attribute.
2. Update `'/auth/signup'` and `'/auth/login'` so user has a id (or gets a new id from `uuidv4`). And after logging in and signing up the `req.session.user` should contain the userId.
3. Make the `req.session` be accessible to `socketio` by using the `authorizeUser` middleware which is shared `socketio` and `express` to move `req.session.user` into `socket.user`. Then we can run `socket.user` in any socket listener.


```js
// socketControllers.js
module.exports.authorizeUser = (socket, next) => {
  if (!socket.request.session || !socket.request.session.user) {
    console.log("BAD REQUEST (authorizeUser)")
    // Errors emit "connect_error" type, which is listed to by the frontend
    next(new Error("Not authorized"))
  } else {
    socket.user = {
      ...socket.request.session.user
    }
    next()
  }
}
```


# Redis and socketIO
Lets make the `socket.user.userId` publicly available to other clients, we do this with redis.
```js
// socketControllers.js
module.exports.authorizeUser = (socket, next) => {
  
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
    redisClient.hset(`userid:${socket.user.username}`, "userid", socket.user.userid)
    next()
  }
}
```