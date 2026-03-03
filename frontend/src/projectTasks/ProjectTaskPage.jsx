import { useEffect, useState } from "react";
import { ProjTaskList } from "./ProjectTasklist.jsx";
import { Link } from "react-router";
import { getAllProjectTasks } from "../api/apiProjects.js";

export default function ProjectTaskPage({ projectId, onSyncTasks }) {
  const [projectTasks, setProjectTasks] = useState([]);

  const syncProjectTasks = async () => {
    const allProjTasks = await getAllProjectTasks(projectId);
    setProjectTasks(allProjTasks);
  };

  useEffect(() => {
    syncProjectTasks();
    onSyncTasks?.(syncProjectTasks);
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
    </div>
  );
}

//
