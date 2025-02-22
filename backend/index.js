const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session")

// redis
const redisClient = require("./redis")


// So server can take websocket requests.
const { Server } = require("socket.io");
const authRouter = require("./routers/auth");
const { sessionMiddleWare, wrap, corsConfi } = require("./controllers/serverController");
const { authorizeUser, addFriend, initializeUser, onDisconnect } = require("./controllers/socketController");

const app = express();

require("dotenv").config()

// this is saying we are `creatingServer`
// and any request which is http is passed into our app Express
const server = require("http").createServer(app);

// 1st arg is what our socketIO will be hosted on
// 2nd arg has cors
const io = new Server(server, {
    cors: { origin: "http://localhost:5173", credentials: true },
});


redisClient.connect().catch(console.error)

// security check middleware
app.use(helmet());
app.use(sessionMiddleWare)
app.use(cors({credentials: true, origin: 'http://localhost:5173'}));
// accept json to be like js object
app.use(express.json());

app.use("/auth", authRouter);
app.get("/", (req, res) => res.json("HI"));

// w/ this layout first it sets up the shared cookies, then...
io.use(wrap(sessionMiddleWare))
// check if the user is authorized.
io.use(authorizeUser)

// then runs the server.j
io.on("connect", (socket) => {
    initializeUser(socket);

    socket.on("add_friend", 
        (friendName, cb) => addFriend(socket, friendName, cb)
    )

    socket.on("disconnecting", () => onDisconnect(socket));
});

server.listen(3000, () =>
    console.log("Server listening http://localhost:3000 ")
);

