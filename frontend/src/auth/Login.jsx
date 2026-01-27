import { useAuth } from "./AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

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
    <>
      <form action={tryLogin}>
        <label>
          Username
          <input type="text" name="username" required />
        </label>
        <label>
          Password
          <input type="password" name="password" required />
        </label>
        <button>Login</button>
        {error && <p role="alert">{error}</p>}
      </form>
    </>
  );
}
