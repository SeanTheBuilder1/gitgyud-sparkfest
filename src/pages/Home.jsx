import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // We'll define styles separately

function Home() {
  return (
    <div className="home-container">
      <div className="home-card">
        <img
          src="/images/qc-logo.png"
          alt="QC Logo"
          className="qc-logo"
        />
        <img
          src="/images/qsee-logo.png"
          alt="QSee Logo"
          className="qsee-logo"
        />
        <p className="tagline">Complaints. Requests. Volunteering.</p>
        <div className="button-group">
          <Link to="/login" className="home-button">Log In</Link>
          <Link to="/signup" className="home-button">Sign Up</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
