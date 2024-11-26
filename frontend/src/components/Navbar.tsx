import React from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="navbar">
      {/* Home Button */}
      <button onClick={goHome} className="navbar-button">
        Home
      </button>

      {/* Title */}
      <h1 className="navbar-title">My Travel App</h1>
    </div>
  );
};

export default Navbar;
