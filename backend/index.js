const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

// So server can take websocket requests.
const { Server } = require("socket.io");
const authRouter = require("./routers/auth");

const app = express();

// this is saying we are `creatingServer`
// and any request which is http is passed into our app Express
const server = require("http").createServer(app);

// 1st arg is what our socketIO will be hosted on
// 2nd arg has cors
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // what our server will be talking to
        credentials: true, //are cookies accepted?
    },
});

// security check middleware
app.use(helmet());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// accept json to be like js object
app.use(express.json());

app.use("/auth", authRouter);
app.get("/", (req, res) => res.json("HI"));

io.on("connect", (socket) => {});

server.listen(3000, () =>
    console.log("Server listening http://localhost:3000 ")
);
