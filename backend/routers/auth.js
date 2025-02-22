const express = require("express");
const {validateController, loginPost, loginGet, signupPost} = require("../controllers/authControllers");
const { rateLimiter } = require("../controllers/rateLimiter");



const authRouter = express();

authRouter.post("/login", validateController, rateLimiter(5, 10), loginPost);
authRouter.get("/login", loginGet)


authRouter.post("/register", validateController, rateLimiter(5, 4), signupPost);

module.exports = authRouter;
