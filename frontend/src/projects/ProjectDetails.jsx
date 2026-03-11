import { useEffect, useState } from "react";
import ProjectTaskPage from "../projectTasks/ProjectTaskPage.jsx";
import ParticipantTaskPage from "../participantTasks/ParticipantTaskPage.jsx";
import { useNavigate, Outlet, useParams } from "react-router";
import { getProject } from "../api/apiProjects.js";
// import { deleteProject } from "../api/apiProjects.js";
import { useAuth } from "../auth/AuthContext.jsx";
import ConfirmModal from "../modal/ConfirmModal.jsx";

export default function ProjectDetails() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const { user, loading } = useAuth();
  const [error, setError] = useState(null);
  const [syncProjectTasks, setSyncProjectTasks] = useState(() => null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      const data = await getProject(projectId);
      setProject(data);
    };
    fetchProject();
  }, [projectId]);

  async function onDeleteProjectHandle() {
    setError(null);
    try {
      const deleteProj = await deleteProject(projectId);
      if (deleteProj?.success) {
        navigate("/projects", { replace: true });
      } else {
        setError(deleteProj?.message || "Failed to delete project");
      }
    } catch (error) {
      setError(error.message);
    }
  }

  if (loading || !project) {
    return <p>Loading project...</p>;
  }

  if (!user) {
    navigate("/projects", { replace: true });
  }

  return (
    <div className="project-detail-header">
      <h2>{project.name}</h2>
      <p>{project.description}</p>
      <button onClick={() => setShowDeletePopup(!showDeletePopup)}>
        Delete Project
      </button>
      {showDeletePopup ? (
        <ConfirmModal
          onConfirm={onDeleteProjectHandle}
          onCancel={() => setShowDeletePopup(false)}
        />
      ) : null}
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
