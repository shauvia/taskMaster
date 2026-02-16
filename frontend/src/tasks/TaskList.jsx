import { Link } from "react-router";

export default function TaskList({ tasks, syncTasks }) {
  return (
    <ul className="sidebar-tasklist">
      {tasks.map((task) => (
        <TaskListItem key={task.id} task={task} syncTasks={syncTasks} />
      ))}
    </ul>
  );
}

function TaskListItem({ task }) {
  const listItem = (
    <li>
      <Link to={`/tasks/${task.id}`}>
        <h3>{task.name}</h3>
      </Link>
    </li>
  );

  return <>{listItem}</>;
}
