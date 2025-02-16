# Formik

```jsx
import * from Yup as "yup"


const Login = () => {
    // this hook's arguments are: - object with the fields with the keys matching the 'names' of the inputs
    const formik = useFormik({ username: "", password: "" },
    // requirements for input when submitting.
    validationSchema: Yup.object({
        username:Yup.string().required("Username required").min(6, "Username too short!").max(28, 'Username too long!'),
        password:Yup.string().required("Username required").min(6, "Username too short!").max(28, 'Username too long!')
    }),
    // what to run when submitting
    onSubmit: (values, action) => {
            alert(JSON.stringify(values, null, 2))
            action.resetForm()
        }
    );

    return (
        // for submitting
        <form onSubmit={formik.handleSubmit} >
            <label>Username:</label>
            <input
                onChange={formik.handleChange}
                // when client unfocuses from input
                onBlur={formik.handleBlur}
                // we user username because
                value={formik.values.username}
                name="username"
            />
            <label>Password</label>
            <input
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                type="password"
                name="password"
            />
        </form>
    );
};
```

### Error checking:

`formik.errors.username` is exists if there is an error
`formik.touched.password` is true if the password input has been clicked.

Error text: `<p>{formik.touched.username && formik.errors.username}</p>`

## Faster Formik

```jsx
// OLD
<input
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    value={formik.values.password}
    type="password"
    name="password"
/>

// NEW
<input
    {...formik.getFieldProps("password")}
    type="password"
    name="password"
/>
```

```jsx
// OLD
const Login = () => {
    const formik = useFormik({props})
    ...
    return (
        <form>
            ...
        </form>
    )
}

// NEW
const Login = () => {
    ...
    return (
        <Formik
            // add the useFormik props here
        >
            { formik =>
                <form>
                    ...
                </form>
            }
        </Formik>
    )
}
```
