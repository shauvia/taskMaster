import { useEffect, useState } from "react";
import ProjectTaskPage from "../projectTasks/ProjectTaskPage.jsx";
import ParticipantTaskPage from "../participantTasks/ParticipantTaskPage.jsx";
import {
  useNavigate,
  Outlet,
  useParams,
  useOutletContext,
  Navigate,
} from "react-router";
import { getProject } from "../api/apiProjects.js";
import { deleteProject } from "../api/apiProjects.js";
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
  const { syncProjects } = useOutletContext();

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
        syncProjects();
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
    return <Navigate to="/" replace />;
  }

  return (
    <div className="project-detail-header">
      <h2>{project.name}</h2>
      <p>{project.description}</p>
      {error && <p className="error">{error}</p>}
      {project.owner_id === user.id && (
        <button
          className="projDeleteBtn"
          onClick={() => setShowDeletePopup(!showDeletePopup)}
        >
          Delete Project
        </button>
      )}
      {showDeletePopup ? (
        <ConfirmModal
          onConfirm={() => {
            (setShowDeletePopup(false), onDeleteProjectHandle());
          }}
          onCancel={() => setShowDeletePopup(false)}
          message={"Wanna delete project? Really? For sure?"}
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
