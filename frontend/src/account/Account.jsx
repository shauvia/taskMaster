import { Link } from "react-router";
import { useAuth } from "../auth/AuthContext";
import { useEffect, useState } from "react";
import TaskPage from "../tasks/TaskPage.jsx";
import { useNavigate } from "react-router";

export default function Account() {
  const { isAuthenticated } = useAuth();
  const [error, setError] = useState(null);

  return (
    <div className="sidebar">
      {isAuthenticated ? (
        <>
          <TaskPage />
        </>
      ) : (
        <p>
          Please <Link to="/login">log in</Link> to see your account.
        </p>
      )}
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
