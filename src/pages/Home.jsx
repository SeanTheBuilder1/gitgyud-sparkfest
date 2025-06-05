import { createRef } from "react";
import { Link, useNavigate } from "react-router";
import supabase from "../supabase-client";
// import "../styles/Home.css"; // We'll define styles separately
import "../App.css"; // ala pa images bruh
const recaptchaRef = createRef();

function Home({ token }) {
    const navigate = useNavigate();
    async function handleLogout() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            alert(error);
            console.log(error);
        } else {
            alert("Logged out\n");
            navigate("/");
        }
    }
    // <img src="../images/qc-logo.png" alt="QC Logo" className="qc-logo" />
    // <img src="../images/qsee-logo.png" alt="QSee Logo" className="qsee-logo" />
    return (
        <div className="home-container">
            <div className="home-card">
                <p className="tagline">Complaints. Requests. Volunteering.</p>
                <div className="button-group">
                    {() => {
                        if (token) {
                            return (
                                <div>
                                    <Link to="/login" className="home-button">
                                        Log In
                                    </Link>
                                    <Link to="/signup" className="home-button">
                                        Sign Up
                                    </Link>
                                </div>
                            );
                        } else {
                            return "";
                        }
                    }}
                </div>
            </div>
            <div>
                Welcome back, {token.user_metadata.username}
                <Link to="/">
                    <button>Check Issues</button>
                </Link>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
}

export default Home;
