import { Link } from "react-router";
import logo from "../logo/logo.png";

export default function Home() {
  return (
    <div className="homepage-container">
      <Link to="/homepage" className="brand">
        <img id="hpLogo" alt="taskmaster logo" src={logo}></img>
      </Link>
      <div id="hpWelcome">
        <h1>Welcome to Taskmaster</h1>
        <p>Your productivity starts here.</p>
        <Link to="/register">
          <p id="hpCreateAccount">Create Account</p>
        </Link>
        <Link to="/login">
          <p id="hpLogin">Login</p>
        </Link>
      </div>
    </div>
  );
}
