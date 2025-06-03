import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

const App = () => {
    const [token, setToken] = useState(false);
    if (token) {
        sessionStorage.setItem("token", JSON.stringify(token));
    }
    useEffect(() => {
        if (sessionStorage.getItem("token")) {
            const data = JSON.parse(sessionStorage.getItem("token"));
            setToken(data);
        }
    }, []);
    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path={"/register"} element={<Register />} />
                <Route path={"/login"} element={<Login />} />
                <Route path={"/login"} element={<Login setToken={setToken} />} />
                {token ? <Route path={"/homepage"} element={<Homepage token={token} />} /> : ""}
            </Routes>
        </div>
    );
};

export default App;
