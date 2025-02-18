# No need to use Passport

# express-session:
Express-session middleware is mainly used for managing the sessions for the user-specific data.
In this case so when user is logged it they stay logged in. 

```jsx
// index.js

...
// Allows the user of cookies
app.use(session({
    secret: process.env.COOKIE_SECRET,
    credentials: true,
    name: "sid",
    resave: false,       // saves the session only if it changes
    saveUninitialized: false,
    cookie: {
        secure: process.env.ENVIRONMENT==="production",
        httpOnly: true,
        sameSite: process.env.ENVIRONMENT==="production" ? "none" : "lax",   // will only be communicated between the same domain unless in production
    }
}))
...



// auth.js
const express = require("express");
const validateController = require("../controllers/authControllers");
const { PrismaClient } = require('@prisma/client')
const bcrypt = require("bcrypt")

const prisma = new PrismaClient()


const authRouter = express();

authRouter.post("/login", async (req, res) => {
  validateController(req, res)  // has the Yup requirements
  console.log(req.session.user) // this will already be defined if user is logged in. This access the cookies.

  // Does user exist?
  const potentialUser = await prisma.user.findFirst({
    where: {
      username: req.body.username
    }
  })

  if (!potentialUser) {
    return res.status(200).json({ loggedIn:false, status: "Username doesn't not exist"})
  } else {
    const isSamePass = await bcrypt.compare(
      req.body.password,
      potentialUser.password
    )

    if (!isSamePass) {
      return res.status(200).json({ loggedIn:false, status: "Username doesn't not exist"})
    } else {
      req.session.user = {username: potentialUser.username, id: potentialUser.id}
      res.json({loggedIn: true, username: potentialUser.username})
    }
  }


});


authRouter.post("/register", async (req, res) => {
  validateController(req, res)
  // does user already exist?
  const existing = await prisma.user.findFirst({
    where: {
      username: req.body.username
    }
  })
  console.log(existing)
  if (existing) {
    return res.json({loggedIn: false, status: "Username taken"})
  } else {
    // get hashed password
    const hashedPass = await bcrypt.hash(req.body.password, 10)
    
    // create the user
    const result = await prisma.user.create({
      data: {
        username: req.body.username,
        password: hashedPass
      }
    })
    // Set the cookie, basically a dictionary in the browser which we define
    req.session.user = {username: result.username, id: result.id}
    res.json({loggedIn: true, username: result.username})
  }
});

module.exports = authRouter;

```



# Make a private route in react router dom
```jsx
// AccountContext.jsx     (CONTEXT PROVIDER)
// make the context
export const AccountContext = createContext()

// Mkae the context provider
export const UserContext = ({children}) => {
  // set this to null or "LOADING" initially because on refresh we can distinguish LOADING webpage from user = {loggedIn: false}
  const [user, setUser] = useState({loggedIn: null});
  return <AccountContext.Provider value={{user, setUser}}>
    {children}
  </AccountContext.Provider>
}


// View.jsx (HAS ROUTES)

const Views = () => {
  return (
    {
      user.loggedIn === null ? <h1 className="text-5xl w-screen text-center">LOADING</h1> : (
        <Routes>
            ...
            <Route element={<PrivateRoutes />}>
                <Route path="/home" element={<Home />} />
            </Route>
            ...
        </Routes>
    )}
  )
}


// PrivateRoutes.jsx
const useAuth = () => {
  const {user} = useContext(AccountContext)
  return user && user.loggedIn
}


const PrivateRoutes = () => {
  const isAuth = useAuth();
  return isAuth ? <Outlet /> : <Navigate to="/" />
}

// Login.jsx
const Login = () => {
  const {setUser, user} = useContext(AccountContext)
  ...

  const onLoginSubmit = () => {
    ...
    setUser({...data})
  }
  ...
}

```

The problem with this is it doesn't use the cookie to maintin logged in status when you refresh the page.