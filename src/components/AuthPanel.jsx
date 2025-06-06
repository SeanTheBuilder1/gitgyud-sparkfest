import { useState, useEffect } from "react";
import supabase from "../supabase-client";
import "./authpanel.css";

export default function AuthPanel({ open, onOpenChange, isLogin, loadSupabaseUser }) {
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });
    const [registerData, setRegisterData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
    });
    const [activeTab, setActiveTab] = useState(false);
    async function loginFormSubmit(e) {
        e.preventDefault();
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: loginData.email,
                password: loginData.password,
            });
            if (error) throw error;
            console.log(data);
            loadSupabaseUser();
            if (!data.user.phone_confirmed_at) {
                // navigate("/phone-otp");
            } else {
            }
            onOpenChange(false);
        } catch (error) {
            alert(error);
        }
    }

    async function registerFormSubmit(e) {
        e.preventDefault();
        try {
            const { data, error } = await supabase.auth.signUp({
                email: registerData.email,
                password: registerData.password,
                options: {
                    data: {
                        username: registerData.name,
                    },
                },
            });
            if (error) throw error;
            console.log(data);
            alert("Check your email address and login for the first time afterwards");
            onOpenChange(false);
        } catch (error) {
            alert(error);
        }
    }

    // const handleDetailsSubmit = (e) => {
    //     e.preventDefault();
    //     if (registerData.phone) {
    //         setStep("otp");
    //     } else {
    //         onLogin(true, registerData.isAdmin);
    //         onOpenChange(false);
    //         resetSignupForm();
    //     }
    // };

    // const handleOtpSubmit = (e) => {
    //     e.preventDefault();
    //     if (otp === "123456") {
    //         onLogin(true, registerData.isAdmin);
    //         onOpenChange(false);
    //         resetSignupForm();
    //     } else {
    //         alert("Invalid OTP. Use 123456 for demo.");
    //     }
    // };

    // const resetSignupForm = () => {
    //     setRegisterData({
    //         email: "",
    //         password: "",
    //         confirmPassword: "",
    //         name: "",
    //         phone: "",
    //         isAdmin: false,
    //     });
    //     setStep("auth");
    //     setOtp("");
    // };

    if (!open) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-card">
                {/* {step === "auth" && ( */}
                <>
                    <div className="modal-header">
                        <h2 className="modal-title">Welcome to QSee</h2>
                        <p className="modal-description">Sign in to your account or create a new one</p>
                    </div>
                    <div className="modal-content">
                        <div className="tabs">
                            <div className="tabs-list">
                                <button
                                    className={`tab-trigger ${activeTab === true ? "active" : ""}`}
                                    onClick={() => setActiveTab(true)}
                                >
                                    Login
                                </button>
                                <button
                                    className={`tab-trigger ${activeTab === false ? "active" : ""}`}
                                    onClick={() => setActiveTab(false)}
                                >
                                    Sign Up
                                </button>
                            </div>

                            <div className={`tab-content ${activeTab === true ? "active" : ""}`}>
                                <form onSubmit={loginFormSubmit} className="form">
                                    <div className="form-group">
                                        <label htmlFor="login-email" className="form-label">
                                            Email
                                        </label>
                                        <input
                                            id="login-email"
                                            type="email"
                                            className="form-input"
                                            value={loginData.email}
                                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="login-password" className="form-label">
                                            Password
                                        </label>
                                        <input
                                            id="login-password"
                                            type="password"
                                            className="form-input"
                                            value={loginData.password}
                                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="button button-primary button-full">
                                        Sign In
                                    </button>
                                </form>
                            </div>

                            <div className={`tab-content ${activeTab === false ? "active" : ""}`}>
                                <form onSubmit={registerFormSubmit} className="form">
                                    <div className="form-group">
                                        <label htmlFor="signup-email" className="form-label">
                                            Email
                                        </label>
                                        <input
                                            id="signup-email"
                                            type="email"
                                            className="form-input"
                                            value={registerData.email}
                                            onChange={(e) =>
                                                setRegisterData({ ...registerData, email: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="username" className="form-label">
                                            Username
                                        </label>
                                        <input
                                            id="username"
                                            type="name"
                                            className="form-input"
                                            value={registerData.password}
                                            onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="signup-password" className="form-label">
                                            Password
                                        </label>
                                        <input
                                            id="signup-password"
                                            type="password"
                                            className="form-input"
                                            value={registerData.password}
                                            onChange={(e) =>
                                                setRegisterData({ ...registerData, password: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="confirm-password" className="form-label">
                                            Confirm Password
                                        </label>
                                        <input
                                            id="confirm-password"
                                            type="password"
                                            className="form-input"
                                            value={registerData.confirmPassword}
                                            onChange={(e) =>
                                                setRegisterData({
                                                    ...registerData,
                                                    confirmPassword: e.target.value,
                                                })
                                            }
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="button button-primary button-full">
                                        Continue
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="button button-ghost" onClick={() => onOpenChange(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </>
                {/*}*/}

                {/* {step === "details" && (
                    <>
                        <div className="modal-header">
                            <h2 className="modal-title">Complete Your Profile</h2>
                            <p className="modal-description">Tell us a bit more about yourself</p>
                        </div>
                        <div className="modal-content">
                            <form onSubmit={handleDetailsSubmit} className="form">
                                <div className="form-group">
                                    <label htmlFor="name" className="form-label">
                                        Full Name
                                    </label>
                                    <input
                                        id="name"
                                        className="form-input"
                                        value={registerData.name}
                                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone" className="form-label">
                                        Phone Number (Optional)
                                    </label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        className="form-input"
                                        placeholder="+63 917 123 4567"
                                        value={registerData.phone}
                                        onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                                    />
                                    <p className="form-hint">
                                        Phone verification required to post reports. You can add this later.
                                    </p>
                                </div>
                                <div className="button-group">
                                    <button
                                        type="button"
                                        className="button button-outline"
                                        onClick={() => setStep("auth")}
                                    >
                                        Back
                                    </button>
                                    <button type="submit" className="button button-primary">
                                        {registerData.phone ? "Verify Phone" : "Complete Signup"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </>
                )}

                {step === "otp" && (
                    <>
                        <div className="modal-header">
                            <h2 className="modal-title">Verify Your Phone</h2>
                            <p className="modal-description">We've sent a verification code to {registerData.phone}</p>
                        </div>
                        <div className="modal-content">
                            <form onSubmit={handleOtpSubmit} className="form">
                                <div className="form-group">
                                    <label htmlFor="otp" className="form-label">
                                        Verification Code
                                    </label>
                                    <input
                                        id="otp"
                                        className="form-input"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="Enter 6-digit code"
                                        maxLength={6}
                                        required
                                    />
                                    <p className="form-hint">For demo purposes, use: 123456</p>
                                </div>
                                <div className="button-group">
                                    <button
                                        type="button"
                                        className="button button-outline"
                                        onClick={() => setStep("details")}
                                    >
                                        Back
                                    </button>
                                    <button type="submit" className="button button-primary">
                                        Verify & Complete
                                    </button>
                                </div>
                            </form>
                        </div>
                    </>
                )} */}
            </div>
        </div>
    );
}
