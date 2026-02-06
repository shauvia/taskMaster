import { useAuth } from "./AuthContext";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import logo from "../logo/logo.png";

export default function Login() {
  const { login, isAuthenticated, loading } = useAuth();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/account");
    }
  }, [loading, isAuthenticated, navigate]);

  const tryLogin = async (formData) => {
    setError(null);
    try {
      const loginCredentials = {
        username: formData.get("username"),
        password: formData.get("password"),
      };
      await login(loginCredentials);
      navigate("/account");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="login-container">
      <Link to="/homepage" className="brand">
        <img id="hpLogo" alt="taskmaster logo" src={logo}></img>
      </Link>
      <form id="loginForm" action={tryLogin}>
        <label htmlFor="username">Username</label>
        <input id="username" type="text" name="username" required />

        <label htmlFor="password">Password</label>
        <input id="password" type="password" name="password" required />

        <button>Login</button>
        {error && <p role="alert">{error}</p>}
      </form>
    </div>
  );
}
