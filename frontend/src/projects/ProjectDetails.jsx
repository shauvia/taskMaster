import { useEffect, useState } from "react";
import ProjectTaskPage from "../projectTasks/ProjectTaskPage.jsx";
import ParticipantTaskPage from "../participantTasks/ParticipantTaskPage.jsx";
import { Navigate, Outlet, useParams } from "react-router";
import { getProject } from "../api/apiProjects.js";
import { useAuth } from "../auth/AuthContext.jsx";

export default function ProjectDetails() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const { user, loading } = useAuth();
  const [syncProjectTasks, setSyncProjectTasks] = useState(() => null);

  useEffect(() => {
    const fetchProject = async () => {
      const data = await getProject(projectId);
      setProject(data);
    };
    fetchProject();
  }, [projectId]);

  if (loading || !project) {
    return <p>Loading project...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="project-detail-header">
      <h2>{project.name}</h2>
      <p>{project.description}</p>
      {user.id !== project.owner_id ? (
        <ParticipantTaskPage projectId={project.id} />
      ) : (
        <ProjectTaskPage
          projectId={project.id}
          onSyncTasks={(syncFn) => {
            setSyncProjectTasks(() => syncFn);
          }}
        />
      )}
      <section className="tasks-detail">
        <Outlet context={{ syncProjectTasks }} />
      </section>
    </div>
  );
}
