import React from "react";
import { useNavigate } from "react-router-dom";
import "./navbar.css"; // Import the CSS file
import "../index.css";
import HandleLogout from "./HandleLogout";

function Navbar({ token, activeTab, setOpen, setIsLogin }) {
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <div className="container">
                <div className="logo">
                    <div className="circle">
                        <img src="/logo.svg"></img>{" "}
                    </div>
                    <span></span>
                </div>

                <div className="nav-links">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className={activeTab === "dashboard" ? "active" : ""}
                    >
                        Dashboard
                    </button>
                    <button onClick={() => navigate("/")} className={activeTab === "community" ? "active" : ""}>
                        Community
                    </button>
                    <button onClick={() => navigate("/map")} className={activeTab === "map" ? "active" : ""}>
                        Report Map
                    </button>
                    <button onClick={() => navigate("/profile")} className={activeTab === "account" ? "active" : ""}>
                        Account
                    </button>
                </div>

                {token ? (
                    <div className="user-info">
                        <span>Welcome, {token.user_metadata.username}</span>
                        <button
                            onClick={() => {
                                HandleLogout(navigate);
                            }}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <div className="user-info">
                        <button
                            onClick={() => {
                                setOpen(true);
                                setIsLogin(false);
                            }}
                        >
                            Register
                        </button>
                        <button
                            onClick={() => {
                                setOpen(true);
                                setIsLogin(true);
                            }}
                        >
                            Login
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
