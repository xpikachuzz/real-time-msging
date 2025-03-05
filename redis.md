# Leveraging Redis w/ React

```js
const redis = require("redis");
const client = redis.createClient({
    url: "redis://localhost:6379", // Replace with your Redis server's URL if different
});

client.on("connect", () => {
    console.log("Connected to Redis server successfully!");
});

client.on("error", (error) => {
    console.error("Redis client encountered an error:", error);
});

(async () => {
    await client.connect();
})();
```

### Set and Get

```js
await client.set(
    "user:1",
    JSON.stringify({
        id: 1,
        username: "johndoe",
        email: "john@example.com",
    })
);
const userData = await client.get("user:1");
const userObject = JSON.parse(userData);
console.log(userObject);
```

### Purpose w/ React

It is good because it can handle user session through caching and its publish/subscribe messaging system which enables real-time data handling.

### User session cache w/ Redis

Session allow for maintaining data between requests from the same user. W/ redis’ face in-memory data store, Redis is good for caching session data. You usually do this by generating a unique session key for each user on login, this key (session) can store and retrieve user-specific data.

```js
const session = require("express-session");
const RedisStore = require("connect-redis")(session);

app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        secret: "my_secret",
        resave: false,
        saveUninitialized: false,
    })
);

// Login endpoint
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    // Authenticate the user...
    // On successful authentication:
    req.session.userId = user.id; // Store user id in session
    res.send("Logged in successfully");
});

// Logout endpoint
app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send("Error logging out");
        }
        res.send("Logged out successfully");
    });
});
```

### Real-time Data Handling w/ Redis Pub/Sub:

Redis pub/sub is a messaging pattern where publishers send messages to channels without knowing who the subscribers will be. Subscribers listen to the channels of interest and receive messages as they are published.

Here's a simple example of how you might use Redis pub/sub in a Node.js server:

```js
// Subscribe to a channel
const subscriber = client.duplicate();
await subscriber.subscribe("updates", (message) => {
    console.log(`Received message: ${message}`);
});

// Publish a message to the channel
const publisher = client.duplicate();
await publisher.publish("updates", "This is a real-time update!");
```

Duplicate is used to create separate client instances for subscribing and publishing. The subscriber listens for messages on the ‘updates’ channel.

### ERROR HANDLING

#### Server-side:

Error handling for when connecting to a Redis server:

```js
client.on("error", (error) => {
    if (error.code === "ECONNREFUSED") {
        // Handle the connection refused error
        console.error(
            "Redis server connection was refused. Is the Redis server running?"
        );
    } else {
        // Handle other types of errors
        console.error("Redis error:", error);
    }
});
```

#### Client-side:

```js
// backend
const key = "user:1";
client.get(key, (err, data) => {
    if (err) {
        console.error(`Error retrieving data for key ${key}:`, err);
    } else {
        console.log(`Data for key ${key}:`, data);
    }
});

// client
fetch("/api/data")
    .then((response) => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then((data) => {
        // Use the data in your component
    })
    .catch((error) => {
        // Handle the error in your component, perhaps by setting an error state
        console.error(
            "There has been a problem with your fetch operation:",
            error
        );
    });
```

# EXTRA EXAMPLE: CRUD

### Setup:

```js
const cors    = require("cors");
const express = require("express");
const app     = express();
const mysql   = require('mysql');
const redis   = require('redis');

// Set up CORS
const corsOptions = {
    origin: "http://localhost:3000"
};
app.use(cors(corsOptions));
// Set json for getting data from request body
app.use(express.json());
// Redis setup
let redisClient;
(async () => {
    redisClient = redis.createClient();
    redisClient.on("error", (error) => console.error(`Error : ${error}`));
    redisClient.on("connect", () => console.log("Redis connected"));
    await redisClient.connect();
})();
…
// Connect to DB, and do app.listen(..)

```

### CRUD:

```js
// Fetching data from Database or Redis
app.get("/todos", async (req, res) => {
    try {
        // Check if cached data exists in Redis or not. If yes, return cached data
        const cachedData = await redisClient.get("todos");
        if (cachedData) {
            return res.send({
                success: true,
                message: "Todos retrieved from cache successfully!",
                data: JSON.parse(cachedData),
            });
        }

        // If cached data doesn't exist, fetch data from database and cache it
        const results = await new Promise((resolve, reject) => {
            DB.query("SELECT * FROM todos", (err, results) => {
                if (err) reject(err);
                resolve(results);
            });
        });

        // If no data found in database, return error message
        if (!results.length) {
            return res.send({
                success: false,
                message: "No todos found!",
                data: results,
            });
        }

        // Cache data in Redis for 1 hour (3600 seconds)
        redisClient.setEx("todos", 3600, JSON.stringify(results));

        // Return response
        return res.send({
            success: true,
            message: "Todos retrieved from database successfully!",
            data: results,
        });
    } catch (error) {
        // Catch any error
        throw error;
    }
});

// Create new todo/ Add todo
app.post("/todos", (req, res) => {
    // Get data from request body
    const { title, description } = req.body;

    // Insert todo into database
    DB.query(
        "INSERT INTO todos (title, description) VALUES (?, ?)",
        [title, description],
        (err, results) => {
            if (err) throw err; // Throw error if any

            // If no rows affected, then todo not inserted
            if (!results.affectedRows) {
                return res.send({
                    success: false,
                    message: "Todo not added!",
                    data: results,
                });
            }

            // Delete cached data from Redis
            redisClient.del("todos");

            // Return response
            return res.send({
                success: true,
                message: "Todo added successfully!",
                data: {
                    id: results.insertId,
                    title,
                    description,
                },
            });
        }
    );
});
```

**FRONTEND:**

```js
// Fetch all todos
const getTodos = async () => {
    try {
        // Fetch data from backend
        const response = await axios.get(`${baseUrl}`);

        // Set todos data to todos state
        setTodos(response.data.data);

        // Show success message
        setSuccessMsg(response.data.message);
    } catch (error) {
        console.log(error.response);

        // Show error message
        setErrorMsg(error.response.data.message);
    } finally {
        // Hide success/error message after 5 seconds
        hideMsg();
    }
};

// Edit todo
const editTodoHandler = async (todo) => {
    // Set todo data to todo form
    setTitle(todo.title);
    setDescription(todo.description);
    setTodoId(todo.id);
    setIsEdit(true);
};

// Update todo
const updateTodoHandler = async (e) => {
    // Prevent default form submission
    e.preventDefault();
    try {
        // Send put request to backend by sending title and description
        const response = await axios.put(`${baseUrl}/${todoId}`, {
            title,
            description,
        });

        // Update todo in todos state
        const updatedTodos = todos.map((todo) => {
            if (todo.id === todoId) {
                todo.title = title;
                todo.description = description;
            }
            return todo;
        });

        // Update todos state
        setTodos(updatedTodos);

        // Reset todo form
        setTitle("");
        setDescription("");
        setTodoId(null);
        setIsEdit(false);

        // Show success message
        setSuccessMsg(response.data.message);
    } catch (error) {
        console.log(error.response);
        // Show error message
        setErrorMsg(error.response.data.message);
    } finally {
        // Hide success/error message after 5 seconds
        hideMsg();
    }
};
```
