import "../App.css";
import supabase from "../supabase-client";
import { useRef, useState, createRef } from "react";
import { Link } from "react-router";
import Navbar from "../components/Navbar"
import ReCAPTCHA from "react-google-recaptcha";
const recaptchaRef = createRef();

function Register({token}) {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const recaptchaRef = useRef();

    const onSubmitWithReCAPTCHA = async () => {
        const token = await recaptchaRef.current.executeAsync();

        // apply to form data
    };
    async function formSubmit(e) {
        e.preventDefault();
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        username: name,
                    },
                },
            });
            if (error) throw error;
            console.log(data);
            alert("Check your email address");
        } catch (error) {
            alert(error);
        }
    }
    return (
        <div>
            <Navbar token={token} activeTab={""}/>
            <h1>Register</h1>
            <form onSubmit={formSubmit}>
                <input
                    name="Email"
                    type={"email"}
                    value={email}
                    required
                    placeholder="Email"
                    onChange={(event) => setEmail(event.target.value)}
                />
                <input
                    name="Username"
                    type={"name"}
                    value={name}
                    required
                    placeholder="Username"
                    onChange={(event) => setName(event.target.value)}
                />
                <input
                    name="Password"
                    type={"password"}
                    value={password}
                    required
                    placeholder="Password"
                    onChange={(event) => setPassword(event.target.value)}
                />
                <button type="submit">Register</button>
                <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY} />
            </form>
            Already have an account? <Link to="/login">Login</Link>
            <br />
            <Link to="/">
                <button>Issues</button>
            </Link>
        </div>
    );
}

export default Register;
