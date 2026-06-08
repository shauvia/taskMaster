import { useAuth } from "./AuthContext";
import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import logo from "../logo/logo.png";
import Spinner from "../shared/Spinner.jsx";

export default function Login() {
  const { login, isAuthenticated, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const verified = searchParams.get("verified");
  const registered = searchParams.get("registered");
  const statusMessage =
    verified === "1"
      ? "Email verified successfully. You can log in."
      : verified === "0"
        ? "Verification link is invalid or expired."
        : registered === "1"
          ? "Account created. Check your email to verify before login."
          : null;

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/account");
    }
  }, [loading, isAuthenticated, navigate]);

  const tryLogin = async (formData) => {
    setError(null);
    setSubmitting(true);
    try {
      const loginCredentials = {
        username: formData.get("username"),
        password: formData.get("password"),
      };
      await login(loginCredentials);
      navigate("/account");
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <Link to="/homepage" className="brand">
        <img id="hpLogo" alt="taskmaster logo" src={logo}></img>
      </Link>
      <form id="loginForm" action={tryLogin}>
        {statusMessage && (
          <p role="status" aria-live="polite">
            {statusMessage}
          </p>
        )}
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          name="username"
          required
          disabled={loading || submitting}
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          name="password"
          required
          disabled={loading || submitting}
        />
        <button disabled={loading || submitting}>
          {submitting ? "Logging in..." : "Login"}
        </button>
        {/* Disable button while loading or submitting to prevent multiple submissions */}
        {submitting && <Spinner label="Signing you in..." />}
        {error && <p role="alert">{error}</p>}
      </form>
    </div>
  );
}
