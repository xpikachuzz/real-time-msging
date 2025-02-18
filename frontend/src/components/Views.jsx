import {useContext} from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import { Home } from "../pages/Home";
import PrivateRoutes from "../pages/PrivateRoutes";
import { AccountContext } from '../context/AccountContext';

const Views = () => {
    const {user} = useContext(AccountContext)

    return (
        <div>
            {
                user.loggedIn === null ? <h1 className="text-5xl w-screen text-center">LOADING</h1> :
                    <>
                        <Routes>
                            <Route path="/" element={<Login />} />
                            <Route path="/register" element={<Signup />} />
                            <Route element={<PrivateRoutes />}>
                                <Route path="/home" element={<Home />} />
                            </Route>
                            <Route path="*" element={<Signup />} />
                        </Routes>
                    </>
            }
        </div>
    );
};

export default Views;
