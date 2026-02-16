import { Link } from "react-router";
export function ProjTaskList({ projectTasks, syncProjectTasks, projectId }) {
  return (
    <ul>
      {projectTasks.map((task) => (
        <ProjTaskListItem
          key={task.id}
          task={task}
          syncProjectTasks={syncProjectTasks}
          projectId={projectId}
        />
      ))}
    </ul>
  );
}

function ProjTaskListItem({ task, projectId }) {
  return (
    <li>
      <Link to={`/projects/${projectId}/tasks/${task.id}`}>
        <h3>{task.name}</h3>
      </Link>
    </li>
  );
}
