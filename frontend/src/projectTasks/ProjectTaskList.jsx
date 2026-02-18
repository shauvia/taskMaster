import { Link } from "react-router";
import { updateTaskCompletion } from "../api/apiTasks.js";

export function ProjTaskList({ projectTasks, syncProjectTasks, projectId }) {
  const handleCheckboxChange = async (taskId, taskCompletion) => {
    try {
      await updateTaskCompletion(taskId, taskCompletion);
      await syncProjectTasks();
    } catch (error) {
      console.error("Error updating project task completion:", error);
    }
  };

  return (
    <ul className="sidebar-tasklist">
      {projectTasks.map((task) => (
        <li key={task.id}>
          <input
            type="checkbox"
            value={task.id}
            checked={task.is_completed || false}
            onChange={() => {
              handleCheckboxChange(task.id, !task.is_completed);
            }}
          />
          <Link to={`/projects/${projectId}/tasks/${task.id}`}>
            <h3>{task.name}</h3>
          </Link>
        </li>
      ))}
    </ul>
  );
}
