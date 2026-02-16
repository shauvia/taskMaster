import { createProject } from "../api/apiProjects.js";
import { useAuth } from "../auth/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router";

export default function CreateProject() {
  const { syncProjects } = useOutletContext();
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const tryCreateProject = async (formData) => {
    setError(null);
    try {
      const createdProject = {
        name: formData.get("projectName"),
        description: formData.get("projectDescription"),
      };
      console.log("createdProject", createdProject);
      await createProject(createdProject.name, createdProject.description);
      await syncProjects();
      navigate("/account");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <h2>Add a New Project</h2>
      <form action={tryCreateProject}>
        <label>
          Project name
          <input type="text" name="projectName" />
        </label>
        <label>
          Description
          <input type="text" name="projectDescription" />
        </label>
        <button>Add project</button>
      </form>
      {error && <p role="alert">{error}</p>}
    </>
  );
}
