import { Link, Outlet } from "react-router";

export default function ProjectList({ projects, syncProjects }) {
  return (
    <ul className="sidebar-tasklist">
      {projects.map((project) => (
        <ProjectListItem
          key={project.id}
          project={project}
          syncProjects={syncProjects}
        />
      ))}
    </ul>
  );
}

function ProjectListItem({ project }) {
  return (
    <li>
      <Link to={`/projects/${project.id}`}>
        <h3>{project.name}</h3>
      </Link>
    </li>
  );
}
