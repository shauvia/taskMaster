import { useEffect, useState } from "react";
// import { ProjTaskList } from "../ProjectTasklist.jsx";
import { Outlet, useNavigate, Link } from "react-router";
import { getAllProjectTasksByMemberIdAndProjectId } from "../api/apiProjects.js";
import { useAuth } from "../auth/AuthContext.jsx";
import ParticipantTaskList from "./ParticipantTaskList.jsx";

export default function ParticipantTaskPage({ projectId }) {
  const { user } = useAuth();
  // const [projectTasks, setProjectTasks] = useState([]);
  const [participantTasks, setParticipantTasks] = useState([]);

  const syncParticipantTasks = async () => {
    const memberTasks = await getAllProjectTasksByMemberIdAndProjectId(
      projectId,
      user.id,
    );
    console.log("memberTasks in ParticipantTaskPage.jsx", memberTasks);
    setParticipantTasks([...memberTasks]);
  };

  // const syncProjectTasks = async () => {
  //   const allProjTasks = await getAllProjectTasks(projectId);
  //   setProjectTasks([...allProjTasks]);
  // };

  // getAllProjectTasksByMemberIdAndProjectId(
  // projectId,
  // memberId,

  useEffect(() => {
    syncParticipantTasks();
  }, [projectId]);

  return (
    <div className="tasks-layout">
      <aside className="tasks-sidebar">
        {participantTasks.length === 0 ? (
          <p>You are not participating in any tasks yet.</p>
        ) : (
          <>
            <h2>Participant Tasks</h2>
            <ParticipantTaskList
              participantTasks={participantTasks}
              projectId={projectId}
              syncParticipantTasks={syncParticipantTasks}
            />
          </>
        )}
      </aside>
      {/* <section className="tasks-detail">
        <Outlet context={{ syncProjectTasks, projectTasks }} />
      </section> */}
    </div>
  );
}
