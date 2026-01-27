import { useAuth } from "./AuthContext";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";

export default function Register() {
  const { register, loading, isAuthenticated } = useAuth();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/account");
    }
  }, [loading, isAuthenticated, navigate]);

  const tryRegister = async (formData) => {
    setError(null);
    const username = formData.get("username");
    const password = formData.get("password");
    try {
      await register({ username, password });
      navigate("/account");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <h1 className="reg">Register for an account</h1>
      {loading && <p>Loading...</p>}
      <form id="registerForm" action={tryRegister}>
        <label>
          Username
          <input type="text" name="username" required disabled={loading} />
        </label>
        <label>
          Password
          <input type="password" name="password" required disabled={loading} />
        </label>
        <button disabled={loading}>Register</button>
        {error && <p role="alert">{error}</p>}
      </form>
      <Link className="reg" to="/login">
        Already have an account? Log in here.
      </Link>
    </>
  );
}
