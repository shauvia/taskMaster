import { Link } from "react-router";
import { updateTaskCompletion } from "../api/apiTasks.js";

export default function TaskList({ tasks, syncTasks }) {
  const handleCheckboxChange = async (taskId, taskCompletion) => {
    try {
      await updateTaskCompletion(taskId, taskCompletion);
      await syncTasks();
    } catch (error) {
      console.error("Error updating task completion:", error);
    }
  };

  return (
    <ul className="sidebar-tasklist">
      {tasks.map((task) => (
        <li key={task.id}>
          <input
            type="checkbox"
            value={task.id}
            checked={task.is_completed || false}
            onChange={() => {
              handleCheckboxChange(task.id, !task.is_completed);
            }}
          />
          <Link to={`/tasks/${task.id}`}>
            <h3>{task.name}</h3>
          </Link>
        </li>
      ))}
    </ul>
  );
}
