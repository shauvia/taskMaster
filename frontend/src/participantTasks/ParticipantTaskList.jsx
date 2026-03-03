import { Link } from "react-router";
import { updateTaskCompletion } from "../api/apiTasks.js";

export default function ParticipantTaskList({
  participantTasks,
  projectId,
  syncParticipantTasks,
}) {
  const handleCheckboxChange = async (taskId, taskCompletion) => {
    try {
      await updateTaskCompletion(taskId, taskCompletion);
      await syncParticipantTasks();
    } catch (error) {
      console.error("Error updating task completion:", error);
    }
  };
  console.log("participantTasks in ParticipantTaskList.jsx", participantTasks);

  return (
    <ul className="sidebar-tasklist">
      {participantTasks.map((task) => (
        <li key={task.id}>
          <input
            type="checkbox"
            value={task.id}
            checked={task.is_completed || false}
            onChange={() => {
              handleCheckboxChange(task.id, !task.is_completed);
            }}
          />
          <Link to={`/projects/${projectId}/participant/tasks/${task.id}`}>
            <h3>{task.name}</h3>
          </Link>
        </li>
      ))}
    </ul>
  );
}
