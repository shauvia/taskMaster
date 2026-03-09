import { NavLink, useNavigate } from "react-router";
import { useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import logo from "../logo/logo.png";
import { Profile } from "../homepage/Profile.jsx";

export default function Navbar() {
  const { logout, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    await logout();
    navigate("/");
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [loading, isAuthenticated]);

  return (
    <header className="site-header">
      {/* Brand link goes to homepage when logged out, account when logged in */}
      <NavLink to={isAuthenticated ? "/account" : "/"} className="navbarBrand">
        <img
          id="logo"
          alt="taskmaster logo"
          src={logo}
          className={isAuthenticated ? "logo-small" : "logo-large"}
        />
      </NavLink>

      <nav className="site-nav">
        {loading ? (
          <span>Loading…</span>
        ) : isAuthenticated ? (
          <>
            <NavLink to="/account" className="nav-link">
              Account
            </NavLink>
            <button onClick={handleLogOut} className="nav-link logout-link">
              Log out
            </button>
            <Profile />
          </>
        ) : null}
      </nav>
    </header>
  );
}
