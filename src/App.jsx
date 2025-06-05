import "./App.css";
import { useState, useEffect } from "react";
import { Register, Login, Home, IssueCreate, Preview, UserProfile, IssueFocus } from "./pages";
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
                <Route path={"/register"} element={<Register />} />
                <Route path={"/login"} element={<Login setToken={setToken} />} />
                <Route path={"/"} element={<Preview token={token} />} />
                <Route path={"/issues/:issue_id"} element={<IssueFocus token={token} />} />
                {token ? <Route path={"/homepage"} element={<Home token={token} />} /> : ""}
                {token ? <Route path={"/profile"} element={<UserProfile token={token} />} /> : ""}
                {token ? <Route path={"/issue-create"} element={<IssueCreate token={token} />} /> : ""}
            </Routes>
        </div>
    );
};

export default App;
