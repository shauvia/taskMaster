import { Link } from "react-router";
import { useState } from "react";
import { updateTask } from "../api/apiTasks.js";
import { useNavigate } from "react-router";
export default function TaskList({ tasks, syncTasks }) {
  return (
    <ul className="sidebar-tasklist">
      {tasks.map((task) => (
        // <Link to={`/tasks/${task.id}`}>
        <TaskListItem key={task.id} task={task} syncTasks={syncTasks} />
        // </Link>
      ))}
    </ul>
  );
}

function TaskListItem({ task, syncTasks }) {
  const listItem = (
    <li>
      <Link to={`/tasks/${task.id}`}>
        <h3>{task.name}</h3>
      </Link>
    </li>
  );

  return (
    <>
      {listItem}
      {/* {error && <p role="alert">{error}</p>} */}
    </>
  );
}
