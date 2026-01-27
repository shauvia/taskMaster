import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import logo from "../logo/logo.png";

export default function Navbar() {
  const { logout, user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    await logout();
    navigate("/");
  };

  if (loading) {
    return (
      <header>
        <NavLink to="/" className="brand">
          <img id="logo" alt="taskmaster logo" src={logo}></img>
        </NavLink>
        <nav>
          <p>Loading...</p>
        </nav>
      </header>
    );
  }

  return (
    <header>
      <NavLink to="/" className="brand">
        <img id="logo" alt="taskmaster logo" src={logo}></img>
      </NavLink>
      <nav>
        {isAuthenticated ? (
          <>
            <NavLink to="/account">Account</NavLink>
            <p
              onClick={(e) => {
                e.preventDefault();
                handleLogOut();
              }}
              className="logout-link"
            >
              Log out
            </p>
          </>
        ) : (
          <>
            <NavLink to="/register">Create Account</NavLink>
            <NavLink to="/login"> Login</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
