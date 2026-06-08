import { Outlet } from "react-router";
import Navbar from "./Navbar";
import { useAuth } from "../auth/AuthContext";
import Spinner from "../shared/Spinner.jsx";

export default function Layout() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <Spinner label="Checking session..." />;
  }

  return (
    <>
      {isAuthenticated && <Navbar />}
      <main>
        <Outlet />
      </main>
    </>
  );
}
