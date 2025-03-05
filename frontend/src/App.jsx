import { useState } from "react";
import "./App.css";
import DarkMode from "./components/DarkMode";
import Views from "./components/Views";
import { UserContext } from "./context/AccountContext";

function App() {
    localStorage.setItem("dark", true);

    return (
        <UserContext>
            <div className="w-screen h-screen flex flex-col justify-center bg-slate-400">
                <DarkMode />
                <Views />
            </div>
        </UserContext>
    );
}

export default App;
