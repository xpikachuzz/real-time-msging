const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session")

// redis
const {RedisStore} = require("connect-redis")
const {createClient} = require("redis")
const redisClient = require("./redis")


// So server can take websocket requests.
const { Server } = require("socket.io");
const authRouter = require("./routers/auth");

const app = express();

require("dotenv").config()


const origin = "http://localhost:5173"



// this is saying we are `creatingServer`
// and any request which is http is passed into our app Express
const server = require("http").createServer(app);

// 1st arg is what our socketIO will be hosted on
// 2nd arg has cors
const io = new Server(server, {
    cors: {
        origin, // what our server will be talking to
        credentials: true, //are cookies accepted?
    },
});


// // Initialize client.
// let redisClient = createClient()



redisClient.connect().catch(console.error)

// Initialize store.
let redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
})

// security check middleware
app.use(helmet());
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
app.use(cors({ origin, credentials: true }));
// accept json to be like js object
app.use(express.json());

app.use("/auth", authRouter);
app.get("/", (req, res) => res.json("HI"));

io.on("connect", (socket) => {});

server.listen(3000, () =>
    console.log("Server listening http://localhost:3000 ")
);

