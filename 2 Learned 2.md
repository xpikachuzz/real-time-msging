# Install:

helmet configures your server so you have basic security.
`npm i socket.io express helmet cors yup`

In `package.json` add

```json
    ...
    "scripts" {
        "dev": "nodemon index.js"
    }
```

# Setup

```js
const express = require("express");
const helmet = require("helmet");

// So server can take websocket requests.
const { Server } = require("socket.io");

const app = express();

// this is saying we are `creatingServer`
// and any request which is http is passed into our app Express
const server = require("http").createServer(app);

// 1st arg is what our socketIO will be hosted on
// 2nd arg has cors
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // what our server will be talking to
        credentials: true, //are cookies accepted?
    },
});

// security check middleware
app.use(helmet());
// accept json to be like js object
app.use(express.json());

app.get("/", (req, res) => res.json("HI"));

io.on("connect", (socket) => {});

server.listen(3000, () =>
    console.log("Server listening http://localhost:3000 ")
);
```

## Yup and Router

```js
const express = require("express");
const Yup = require("yup");

// define the schema (shape of the data)
const formSchema = Yup.object({
    username: Yup.string()
        .required("Username required!")
        .min(6, "Username too short")
        .max(28, "Username too long"),
    password: Yup.string()
        .required("Password required!")
        .min(6, "Password too short")
        .max(28, "Password too long"),
});
const authRouter = express();

authRouter.post("/login", (req, res) => {
    const formData = req.body;

    formSchema
        .validate(formData)
        .catch((err) => {
            res.status(422).send();
            // this is from Yup, it is an array of errors
            console.log(err.error);
        })
        .then((valid) => {
            if (valid) res.json("FORM IS GOOD");
        });
});
```
