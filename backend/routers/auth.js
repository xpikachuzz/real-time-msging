const express = require("express");
const validateController = require("../controllers/authControllers");

const authRouter = express();

authRouter.post("/login", validateController);
authRouter.post("/register");

module.exports = authRouter;
