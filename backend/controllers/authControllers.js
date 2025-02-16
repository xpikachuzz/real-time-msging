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

const validateController = (req, res) => {
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
};

module.exports = validateController;
