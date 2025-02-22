const Yup = require("yup");
const { PrismaClient } = require('@prisma/client')
const bcrypt = require("bcrypt");
const {v4: uuidv4} = require("uuid")

const prisma = new PrismaClient()


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

const validateController = (req, res, next) => {
    const formData = req.body;

    formSchema
        .validate(formData)
        .catch((err) => {
            res.status(422).json();
            // this is from Yup, it is an array of errors
            console.log(err.error);
        })
        .then((valid) => {
            if (valid) {
                next()
            } else {
                res.status(422).json("Please try again.")
            }
        });
};

// Login
const loginPost = async (req, res) => {
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
      req.session.user = {
        username: potentialUser.username, 
        id: potentialUser.id,
        userId: potentialUser.userId
      }
      res.json({loggedIn: true, username: potentialUser.username})
    }
  }
}

const loginGet = async (req, res) => {
  // user specific cookie
  if (req.session.user && req.session.user.username) {
    res.json({loggedIn: true, username: req.session.user.username})
  } else {
    res.json({loggedIn: false})
  }
}

// Sign up
const signupPost =  async (req, res) => {
    // does user already exist?
    const existing = await prisma.user.findFirst({
      where: {
        username: req.body.username
      }
    })
    if (existing) {
      return res.json({loggedIn: false, status: "Username taken"})
    } else {
      // get hashed password
      const hashedPass = await bcrypt.hash(req.body.password, 10)
      const userId = uuidv4()
      // create the user
      const result = await prisma.user.create({
        data: {
          username: req.body.username,
          password: hashedPass,
          userId
        }
      })
      // Set the cookie, basically a dictionary in the browser which we define
      req.session.user = {
        username: result.username, 
        id: result.id,
        userId
      }
      res.json({loggedIn: true, username: result.username})
    }
}


module.exports = {validateController, loginPost, loginGet, signupPost};
