export default function TaskList({ tasks }) {
  return (
    <ul>
      {tasks.map((task) => (
        <TaskListItem key={task.id} task={task} />
      ))}
    </ul>
  );
}

function TaskListItem({ task }) {
  return (
    <li>
      <h3>{task.name}</h3>
      <p>{task.description}</p>
      <p>{task.due_date}</p>
    </li>
  );
}
