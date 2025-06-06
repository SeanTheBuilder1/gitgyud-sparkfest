import "../App.css";
import supabase from "../supabase-client";
import { useRef, useState, createRef } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "../components/Navbar"
import ReCAPTCHA from "react-google-recaptcha";
const recaptchaRef = createRef();

function PhoneRegister({ token, loadSupabaseUser }) {
    const navigate = useNavigate();

    const [otp_sent, setOtpSent] = useState(false);
    const [number, setNumber] = useState("");
    const [code, setCode] = useState("");

    const recaptchaRef = useRef();

    const onSubmitWithReCAPTCHA = async () => {
        const token = await recaptchaRef.current.executeAsync();

        // apply to form data
    };
    async function formSubmit(e) {
        e.preventDefault();
        try {
            const { data, error } = await supabase.auth.updateUser({ phone: number });
            if (error) throw error;
            console.log(data);
            setOtpSent(true);
            // loadSupabaseUser();
            // navigate("/");
        } catch (error) {
            alert(error);
        }
    }
    async function formSubmitVerify(e) {
        e.preventDefault();
        try {
            const { data, error } = await supabase.auth.verifyOtp({ phone: number, token: code, type: "sms" });
            if (error) throw error;
            console.log(data);
            // loadSupabaseUser();
            // navigate("/");
        } catch (error) {
            alert(error);
        }
    }

    if (!otp_sent) {
        return (
            <div>
                <form onSubmit={formSubmit}>
                    <input
                        type="number"
                        name="Phone Number"
                        value={number}
                        required
                        placeholder="09123456789"
                        onChange={(event) => setNumber(event.target.value)}
                    ></input>
                    <button type="submit">Send OTP</button>
                </form>
            </div>
        );
    } else {
        return (
            <div>
                <form onSubmit={formSubmitVerify}>
                    <input
                        type="number"
                        name="OTP"
                        value={number}
                        required
                        placeholder="123456"
                        onChange={(event) => setCode(event.target.value)}
                    ></input>
                    <button type="submit">Verify OTP</button>
                </form>
            </div>
        );
    }
}

export default PhoneRegister;
