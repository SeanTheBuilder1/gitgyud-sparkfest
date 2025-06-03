import "../App.css";
import supabase from "../supabase-client";
import { useRef, useState, createRef } from "react";
import { Link } from "react-router";
import ReCAPTCHA from "react-google-recaptcha";
const recaptchaRef = createRef();

function Homepage({ token }) {
    const recaptchaRef = useRef();

    const onSubmitWithReCAPTCHA = async () => {
        const token = await recaptchaRef.current.executeAsync();

        // apply to form data
    };
    function handleLogout() {
        sessionStorage.removeItem("token");
    }
    return (
        <div>
            Welcome back, {token.user.user_metadata.username}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Homepage;
