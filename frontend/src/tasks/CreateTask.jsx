import { createTask } from "../api/apiTasks.js";
import { useAuth } from "../auth/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router";

export default function CreateTask() {
  const { syncTasks } = useOutletContext();
  const { isAuthenticated } = useAuth();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const tryCreateTask = async (formData) => {
    setError(null);
    try {
      const createdTask = {
        name: formData.get("taskName"),
        description: formData.get("description"),
        due_date: formData.get("dueDate") || null,
      };
      console.log("createdTask", createdTask);
      await createTask(createdTask);
      await syncTasks();
      navigate("/account");
    } catch (e) {
      setError(e.message);
    }
  };

  const justTaskForm = (
    <>
      <h2>Add a new task</h2>
      <form action={tryCreateTask}>
        <label>
          Task name
          <input type="text" name="taskName" required />
        </label>
        <label>
          Description
          <input type="text" name="description" />
        </label>
        <label>
          Due date
          <input type="date" name="dueDate" />
        </label>
        <button>Add task</button>
      </form>
      {error && <p role="alert">{error}</p>}
    </>
  );
  return <>{justTaskForm}</>;
}
