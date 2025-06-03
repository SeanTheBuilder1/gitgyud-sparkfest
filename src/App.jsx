import "./App.css";
import { Register, Login } from "./pages";
import Home from "./pages/Home/Home"; // need fixing path
import { Routes, Route } from "react-router-dom";

const App = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path={"/register"} element={<Register />} />
                <Route path={"/login"} element={<Login />} />
            </Routes>
        </div>
    );
};

export default App;
