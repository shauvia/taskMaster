import { Link } from "react-router";
import { useAuth } from "../auth/AuthContext";
import { useEffect, useState } from "react";
import TaskPage from "../tasks/TaskPage.jsx";
import CreateTask from "../tasks/CreateTask.jsx";
import { useNavigate } from "react-router";

export default function Account() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  console.log("account user", user);
  // const [userAccount, setUserAccount] = useState({});
  const [error, setError] = useState(null);
  // TaskList({ tasks })
  useEffect(() => {
    (async () => {
      setError(null);
      try {
        // user = await accountDetails(token);
        // setUserAccount(user);
      } catch (e) {
        console.log("Error:", e.message);
        setError(e.message);
      }
    })();
  }, []);

  return (
    <>
      {isAuthenticated ? (
        <>
          <h2>Welcome, {user.username}</h2>
          <TaskPage />
          <button onClick={() => navigate("/createTask")}>
            Create a new task
          </button>
        </>
      ) : (
        <p>
          Please <Link to="/login">log in</Link> to see your account.
        </p>
      )}
      {error && <p role="alert">{error}</p>}
    </>
  );
}
