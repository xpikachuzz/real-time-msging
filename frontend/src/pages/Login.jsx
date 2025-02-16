import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import TextField from "../components/TextField";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    return (
        <Formik
            initialValues={{
                username: "",
                password: "",
            }}
            validationSchema={Yup.object({
                username: Yup.string()
                    .required("Username required")
                    .min(6, "Username too short!")
                    .max(28, "Username too long!"),
                password: Yup.string()
                    .required("Username required")
                    .min(6, "Username too short!")
                    .max(28, "Username too long!"),
            })}
            // what to run when submitting
            onSubmit={(values, action) => {
                fetch("http://localhost:3000/auth/login", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(values),
                })
                    .catch((err) => "Error")
                    .then((res) => {
                        if (!res || !res.ok || res.status > 400) {
                            return;
                        }
                        return res.json();
                    })
                    .then((data) => {
                        if (!data) return;
                        console.log(data);
                    });
            }}
        >
            {(formik) => (
                <form
                    onSubmit={formik.handleSubmit}
                    className="max-w-xl max-md:w-11/12 px-4 mx-auto h-screen bg-slate-700 text-sky-200 flex flex-col justify-center"
                >
                    <TextField
                        prompt={"Username"}
                        name={"username"}
                        isTouched={formik.touched.username}
                        error={formik.errors.username}
                        inputProps={{
                            type: "username",
                            placeholder: "Enter username",
                        }}
                        getFieldProps={formik.getFieldProps("username")}
                    />

                    <TextField
                        prompt={"Password"}
                        name={"password"}
                        isTouched={formik.touched.password}
                        error={formik.errors.password}
                        inputProps={{
                            type: "password",
                            placeholder: "Enter password",
                        }}
                        getFieldProps={formik.getFieldProps("password")}
                    />

                    <div className="flex justify-center gap-3">
                        <button
                            type="submit"
                            className="border-2 border-teal-500 hover:border-teal-600 bg-teal-500 px-4 py-2 rounded-xl font-bold text-black text-lg"
                        >
                            Log in
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/register")}
                            className="border-2 border-gray-800 bg-gray-800 hover:bg-gray-500  px-4 py-2 rounded-xl font-bold text-white text-lg"
                        >
                            Create Account
                        </button>
                    </div>
                </form>
            )}
        </Formik>
    );
};

export default Login;
