import { useEffect, useState } from "react";
import { ProjTaskList } from "./ProjectTasklist.jsx";
import { Outlet, useNavigate, Link } from "react-router";
import { getAllProjectTasks } from "../api/apiProjects.js";

export default function ProjectTaskPage({ projectId }) {
  const [projectTasks, setProjectTasks] = useState([]);
  const syncProjectTasks = async () => {
    const allProjTasks = await getAllProjectTasks(projectId);
    setProjectTasks([...allProjTasks]);
  };

  useEffect(() => {
    syncProjectTasks();
  }, [projectId]);

  return (
    <div className="tasks-layout">
      <aside className="tasks-sidebar">
        <div className="sidebar-header">
          <Link to={`/projects/${projectId}/tasks/new`}>
            <button>+</button>
          </Link>
        </div>
        {projectTasks.length === 0 ? (
          <p>
            No tasks yet. Click <span>+</span> + to create one.
          </p>
        ) : (
          <ProjTaskList
            projectTasks={projectTasks}
            syncProjectTasks={syncProjectTasks}
            projectId={projectId}
          />
        )}
      </aside>
      <section className="tasks-detail">
        <Outlet context={{ syncProjectTasks }} />
      </section>
    </div>
  );
}

//
