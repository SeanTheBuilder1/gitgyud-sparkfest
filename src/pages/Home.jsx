import { createRef } from "react";
import { Link } from "react-router";
// import "../styles/Home.css"; // We'll define styles separately
import "../App.css"; // ala pa images bruh
const recaptchaRef = createRef();

function Home({ token }) {
    function handleLogout() {
        sessionStorage.removeItem("token");
    }
    // <img src="../images/qc-logo.png" alt="QC Logo" className="qc-logo" />
    // <img src="../images/qsee-logo.png" alt="QSee Logo" className="qsee-logo" />
    return (
        <div className="home-container">
            <div className="home-card">
                <p className="tagline">Complaints. Requests. Volunteering.</p>
                <div className="button-group">
                    <Link to="/login" className="home-button">
                        Log In
                    </Link>
                    <Link to="/signup" className="home-button">
                        Sign Up
                    </Link>
                </div>
            </div>
            <div>
                Welcome back, {token.user.user_metadata.username}
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
}

export default Home;
