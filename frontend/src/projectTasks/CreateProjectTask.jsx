import { useAuth } from "../auth/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { createProjectTask } from "../api/apiProjects.js";
import { getAllUsers } from "../api/apiUsers.js";

export default function CreateProjectTask() {
  const { syncProjectTasks } = useOutletContext();
  const { isAuthenticated } = useAuth();
  const [error, setError] = useState(null);
  const { projectId } = useParams();
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const loadUsers = async () => {
      const users = await getAllUsers();
      setAllUsers(users);
    };
    loadUsers();
  }, [projectId]);

  const tryCreateTask = async (formData) => {
    setError(null);
    try {
      const rawAssignee = formData.get("assigneeId");
      const assigneeId = rawAssignee === "" ? null : Number(rawAssignee);

      const createdProjectTask = {
        name: formData.get("taskName"),
        description: formData.get("description") || null,
        due_date: formData.get("dueDate") || null,
        assignee_id: assigneeId,
      };
      console.log("createdProjectTask:", createdProjectTask);

      await createProjectTask(createdProjectTask, projectId);
      await syncProjectTasks();
      navigate(`/projects/${projectId}`);
    } catch (error) {
      setError(error.message);
    }
  };

  const projectTaskForm = (
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
          <input type="datetime-local" name="dueDate" />
        </label>
        <label>
          Pick a collaborator
          <select name="assigneeId" defaultValue="">
            <option value="">Choose an eager collaborator</option>
            {allUsers.map((user) => (
              <option key={user.id} value={String(user.id)}>
                {user.username}
              </option>
            ))}
          </select>
        </label>
        <button>Save</button>
      </form>
      {error && <p role="alert">{error}</p>}
    </>
  );

  return <>{projectTaskForm}</>;
}
