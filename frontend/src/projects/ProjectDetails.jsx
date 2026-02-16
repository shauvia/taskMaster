import { useEffect, useState } from "react";
import ProjectTaskPage from "../projectTasks/ProjectTaskPage.jsx";
import { useParams } from "react-router";
import { getProject } from "../api/apiProjects.js";

export default function ProjectDetails() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      const data = await getProject(projectId);
      setProject(data);
    };
    fetchProject();
  }, [projectId]);

  if (!project) {
    return <p>Loading project...</p>;
  }

  return (
    <div className="project-detail-header">
      <h2>{project.name}</h2>
      <p>{project.description}</p>
      <ProjectTaskPage projectId={project.id} />
    </div>
  );
}
