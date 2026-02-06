import { Outlet } from "react-router";
import Navbar from "./Navbar";
import { useAuth } from "../auth/AuthContext";

export default function Layout() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <>
        <main style={{ padding: 20 }}>Loading…</main>
      </>
    );
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
