import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import logo from "../logo/logo.png";

export default function Navbar() {
  const { logout, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    await logout();
    navigate("/");
  };

  // if (loading) {
  //   return (
  //     <header>
  //       <NavLink to="/" className="brand">
  //         <img id="logo" alt="taskmaster logo" src={logo}></img>
  //       </NavLink>
  //       <nav>
  //         <p>Loading...</p>
  //       </nav>
  //     </header>
  //   );
  // }

  return (
    <header className="site-header">
      {/* Brand link goes to homepage when logged out, account when logged in */}
      <NavLink to={isAuthenticated ? "/account" : "/"} className="brand">
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
          </>
        ) : null}
        {/* // : (
        //   <>
        //     <h1>Welcome to Taskmaster</h1>
        //     <p>Your productivity starts here.</p>
        //     <NavLink to="/register" className="nav-link">
        //       Register
        //     </NavLink>
        //     <NavLink to="/login" className="nav-link">
        //       Log in
        //     </NavLink>
        //   </>
        // ) */}
      </nav>
    </header>
  );
}

{
  /* <header>
      {isAuthenticated ? (
        <>
          <NavLink to="/homepage" className="brand">
            <img id="logo" alt="taskmaster logo" src={logo}></img>
          </NavLink>
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
          <Home />
        </>
      )}
    </header> */
}
