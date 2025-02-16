import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import DarkMode from "./components/DarkMode";
import Views from "./components/Views";

function App() {
    const [count, setCount] = useState(0);

    localStorage.setItem("dark", true);

    return (
        <div className="w-screen h-screen flex flex-col justify-center bg-slate-400">
            <DarkMode />
            <Views />
        </div>
    );
}

export default App;
