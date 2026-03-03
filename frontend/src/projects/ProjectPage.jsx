import { useEffect, useState } from "react";
import { getProjects } from "../api/apiProjects.js";
import { getProjectsByMemberId } from "../api/apiProjects.js";
import ProjectList from "./ProjectList.jsx";
import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext.jsx";

export default function ProjectPage() {
  const [projects, setProjects] = useState([]);
  const [projectsByMember, setProjectsByMember] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuth();

  const syncProjects = async () => {
    const allProjects = await getProjects();
    console.log("allProjects", allProjects);
    setProjects([...allProjects]);
  };

  const syncProjectsByMember = async () => {
    if (!user?.id) {
      setProjectsByMember([]);
      return;
    }
    console.log("syncProjectsByMember, userId", user.id);
    const memberProjects = await getProjectsByMemberId(user.id);
    console.log("memberProjects", memberProjects);
    setProjectsByMember([...memberProjects]);
  };

  useEffect(() => {
    syncProjects();
  }, []);

  useEffect(() => {
    syncProjectsByMember();
    console.log("projectsByMember", projectsByMember);
  }, [user?.id]);

  return (
    <div className="tasks-layout">
      <aside className="tasks-sidebar">
        <div className="sidebar-header">
          <button onClick={() => navigate("/projects/new")}>+</button>
        </div>
        {projects.length === 0 && projectsByMember.length === 0 ? (
          <p>
            No projects yet? Click <span>+</span> to create one.
          </p>
        ) : (
          <>
            <ProjectList projects={projects} />
            <h2>Participant Projects</h2>
            <ProjectList projects={projectsByMember} />
          </>
        )}
      </aside>
      <section className="tasks-detail">
        <Outlet
          context={{
            syncProjects,
            projects,
          }}
        />
      </section>
    </div>
  );
}
