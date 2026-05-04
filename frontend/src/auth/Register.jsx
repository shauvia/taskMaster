import { useAuth } from "./AuthContext";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import logo from "../logo/logo.png";

export default function Register() {
  const { register, loading, isAuthenticated } = useAuth();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const tryRegister = async (formData) => {
    setError(null);
    const username = formData.get("username");
    const password = formData.get("password");
    const email = formData.get("email");
    try {
      await register({ username, password, email });
      navigate("/login?registered=1");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="register-container">
      <Link to="/homepage" className="brand">
        <img id="hpLogo" alt="taskmaster logo" src={logo}></img>
      </Link>
      <div className="reg">
        <h1 className="regLabel">Register for an account</h1>
        {loading && <p>Loading...</p>}
        <form id="registerForm" action={tryRegister}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            name="username"
            required
            // aria-describedby="username-error" what does it do?

            disabled={loading}
          />
          {/* <span id="username-error" role="alert" style={{ color: "red" }}>
            Username is required
          </span> */}

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            required
            disabled={loading}
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            required
            disabled={loading}
          />
          <button disabled={loading}>Register</button>
          {error && <p role="alert">{error}</p>}
        </form>
        <Link className="regLabel" to="/login">
          Already have an account? Log in here.
        </Link>
      </div>
    </div>
  );
}
