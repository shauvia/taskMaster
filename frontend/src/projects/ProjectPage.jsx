import { useEffect, useState } from "react";
import { getProjects } from "../api/apiProjects.js";
import ProjectList from "./ProjectList.jsx";
import { Outlet, useNavigate } from "react-router";

export default function ProjectPage() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  const syncProjects = async () => {
    const allProjects = await getProjects();
    console.log("allProjects", allProjects);
    setProjects([...allProjects]);
  };

  useEffect(() => {
    syncProjects();
  }, []);
  return (
    <div className="tasks-layout">
      <aside className="tasks-sidebar">
        <div className="sidebar-header">
          <button onClick={() => navigate("/projects/new")}>+</button>
        </div>
        {projects.length === 0 ? (
          <p>
            No projects yet? Click <span>+</span> to create one.
          </p>
        ) : (
          <ProjectList projects={projects} syncProjects={syncProjects} />
        )}
      </aside>
      <section className="tasks-detail">
        <Outlet context={{ syncProjects, projects }} />
      </section>
    </div>
  );
}
