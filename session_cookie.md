# Understanding Sessions and Cookies in Node.js

HTTP is a set of rules for transferring files and data that makeup websites. It was designed to be stateless, which means each request from client is to be treater like a new interaction, with no memory of previous requests.
Session and Cookies fix this limitation.

## Introduction

Session exists so you can maintain state (data) across multiple http requests. This allows for data to be associated with specific user session.
On the other hand, cookies are small pieces of data stored in the client’s browser. They track behavior, store user preference and facilitate authentication.

## Cookies

Cookies are small pieces of data in the client’s browser. Cookies are sent with each http request so they can see the state between different pages/visits of the website.
Components:

1. name: The key or identifier for the cookie. It's the name by which the cookie is referenced.
2. value: The data stored within the cookie. This is the information the server wants to remember about the user.
3. expires: The date and time when the cookie will expire. After this, the cookie will automatically be removed.
4. path: This defines the scope of the cookie within the domain – which URLs the cookie should be sent to.
5. domain: Specifies which domain the cookie belongs to. It sets the scope of the cookie to the specified domain and its subdomains.
6. secure: A flag indicating that the cookie should only be sent over secure protocols like HTTPS.
7. HttpOnly: A flag that helps mitigate the risk of client side script accessing the protected cookie.

### Setup 1

Add to Node.js:

1. Use `cookie-parser` middleware
   `app.use(cookieParser()) `

2. Set and read cookies in your router handlers or middleware like this:

```js
// Set a cookie
app.get("/set-cookie", (req, res) => {
    res.cookie("username", "chetan_patil", {
        // "expires" - The cookie expires in 24 hours
        expires: new Date(Date.now() + 86400000),
        // "path" - The cookie is accessible for APIs under the '/api' route
        path: "/api",
        // "domain" - The cookie belongs to the 'example.com' domain
        domain: "example.com",
        // "secure" - The cookie will be sent over HTTPS only
        secure: true,
        // "HttpOnly" - The cookie cannot be accessed by client-side scripts
        httpOnly: true,
    });
    res.send("Cookie set");
});

// Read a cookie
app.get("/get-cookie", (req, res) => {
    const username = req.cookies.username;
    res.send(`Username: ${username}`);
});
```

-   path: This limits the cookie's scope to a particular path on the domain. Only requests to 'example.com/api' will include this cookie.

### Setup 2 (set and get are the same as above):

```js
http.createServer((req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/plain",
        "Set-Cookie": [
            "name=example; Max-Age=9000; HttpOnly",
            "preferences=dark; Expires=Wed, 09 Jun 2021 10:18:14 GMT",
            "sessionToken=abc123; Path=/; Secure; HttpOnly",
            "shoppingCart=12345; Domain=example.com;",
            "logged_in=true; Secure; Path=/; Domain=example.com; HttpOnly",
        ],
    });

    res.end("Cookie set!");
}).listen(8080);
```

This sets cookies named “username” with the value ‘chetan_patil’ and the cookie’s maximum age is 900,000 ms (15 minutes).

## Sessions

Unlike cookies, which are stored on the client’s browser, sessions store data on the server-side. Sessions usually have the following components:

1. Session Identifier: A unique identifier assigned to each user session. This identifier is often stored in a cookie on the client’s browser or appended to the URL as a query parameter.
2. Session Data: Information associated with the user session, such as user authentication status, user preferences, and shopping cart contents.
3. **Session Lifecycle**:
    1. **The Beginning**: When you first visit a website, the server gives you a unique session ID, which is stored in a cookie on your browser.
    2. **During the Visit**: With every request you make to the server (clicking links, submitting forms, etc.), your browser sends back that session cookie, reminding the server who you are. The server uses this ID to retrieve your session data from its memory or database.
    3. **Storing Information**: This session data can store anything from what items you've added to a shopping cart to whether you're logged in.
    4. **Session Ends**: When you log out, close your browser, or after a period of inactivity, the session ends. Just like returning the ID badge, your unique visit data on the server can be cleared.

Configure express session as below, the secret key should be kept hidden, and the other 2 properties are for performance.

```js
const express = require("express");
const session = require("express-session");
const app = express();

// Use express-session middleware
app.use(
    session({
        secret: "your_secret_key", // A secret key used to sign the session ID cookie
        resave: false, // Forces the session to be saved back to the session store
        saveUninitialized: false, // Forces a session that is "uninitialized" to be saved to the store
        cookie: {
            maxAge: 3600000, // Sets the cookie expiration time in milliseconds (1 hour here)
            httpOnly: true, // Reduces client-side script control over the cookie
            secure: true, // Ensures cookies are only sent over HTTPS
        },
    })
);

app.get("/store", (req, res) => {
    // Save some data in the session
    req.session.customData = "This is saved in session.";
    res.send("Data has been saved in the session.");
});

app.get("/retrieve", (req, res) => {
    // Check if the session data exists before trying to access it
    if (req.session.customData) {
        res.send(`Here's your session data: ${req.session.customData}`);
    } else {
        res.send("No session data found.");
    }
});
```

-   **resave & saveUninitialized**: These options control when the session gets saved.
    -   **resave**: false means the session won't be stored on every request but only if there was a change.
    -   **saveUninitialized**: false means no session will be saved if it's new and hasn't been modified, which is useful to save resources and also for consent laws in some areas.

**Request**:

```js
app.get("/set-session", (req, res) => {
    req.session.username = "chetan_patil";
    res.send("Session data set");
});

app.get("/get-session", (req, res) => {
    const username = req.session.username;
    res.send(`Username: ${username}`);
});
```

‘username’ is set to ‘chetan_patil’

**Storage option**:
We can store sessions in-memory, db, external sessions like Redis or MongoDB.

```js
app.use(
    session({
        secret: "secret-key",
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
        ...
    })
);
```

**Secure Cookies**:

```js
app.use(
    session({
        secret: "secret-key",
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
);
```

**CSRF**:
CSRF tricks attacker into making an unintended HTTP requests…

```js
const csrf = require("csurf");
app.use(csrf());
app.get("/login", (req, res) => {
    // Generate and include CSRF token in login form
    res.render("login", { csrfToken: req.csrfToken() });
});
app.post("/login", (req, res) => {
    // Verify CSRF token before processing login request
});
```

**Rotate Session Ids**:
Periodically rotate session ids to mitigate attacks.

```js
req.session.regenerate((err) => {
    // New session identifier generated
});
```

**Encrypt session data**:

```js
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
app.use(
    session({
        secret: "secret-key",
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
        resave: false,
        saveUninitialized: false,
        cookie: { secure: true },
    })
);
```

### Best Practices

1. HTTPS w/ TLS: to protect cookie data in transit (it contains session). Use the `secure` attribute to send over HTTPS
2. Set Cookie attributes properly: HttpOnly, SameSite, Domain, Path.
3. Minimize sensitive data in session: Don’t include password & personal info in session, use it to reference data which is stored securely.
4. Session expiration
5. Regenerate session ids: change session id often.
