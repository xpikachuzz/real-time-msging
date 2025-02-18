# Problem with using express-session
The user sessions currently (only using express-session) is stored in memory of backend, so all user sid would be stored in memory. This can cause memory leaks and does not scale at all.

Also with session when you restart the node.js file (e.g. by updaing it) you will have to re-login even if the client has a sid being passed to backend. That is because the `app.use(session(...))` would reset.

`redis` will fix this:
# Redis
`npm i ioredis connect-redis`

and make sure [redis is installed on pc](https://www.youtube.com/watch?v=DLKzd3bvgt8), (check with `redis-cli` in terminal)

```js
// index.js
...
const session = require("express-session")

// redis
const {RedisStore} = require("connect-redis")
const {createClient} = require("redis")


...
// Initialize client.
let redisClient = createClient()
redisClient.connect().catch(console.error)

// Initialize store.
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
})



// security check middleware
app.use(session({
    ...
    store: redisStore,
    ...
}))
```


# Rate Limit Redis
We do this to stop ddos, and reduce resources use (retrieving data from db).

`npm i ioredis`

```jsx
// redis.js. 
// Define redisClient on different file and use in index.js and anywhere else needed.
const Redis = require('ioredis')
const { createClient } = require('redis')

const redisClient = new createClient()

module.exports = redisClient


// auth.js
...
authRouter.post("/login", validateController, rateLimiter(60, 10), loginPost);
...


// rateLimiter.js
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


```