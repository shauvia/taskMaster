import { Link } from "react-router";
import { useAuth } from "../auth/AuthContext";
import { useState } from "react";
import TaskPage from "../tasks/TaskPage.jsx";
import ProjectPage from "../projects/ProjectPage.jsx";

export default function Account() {
  const { isAuthenticated, user } = useAuth();
  const [error, setError] = useState(null);
  console.log("user in Account.jsx", user.id, user.username);

  return (
    <div className="account-grid">
      {isAuthenticated ? (
        <>
          <TaskPage />
          <ProjectPage />
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
