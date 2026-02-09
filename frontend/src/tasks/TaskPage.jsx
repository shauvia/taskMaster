import { useEffect, useState } from "react";
import { getTasks } from "../api/apiTasks.js";
import TaskList from "./TaskList.jsx";
import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const syncTasks = async () => {
    console.log("syncTasks start");
    const allTasks = await getTasks();
    console.log("getTasks returned", allTasks);
    setTasks([...allTasks]);
    console.log("setTasks done");
  };

  useEffect(() => {
    syncTasks();
  }, []);

  return (
    <div className="tasks-layout">
      <aside className="tasks-sidebar">
        <div className="sidebar-header">
          <button onClick={() => navigate("/tasks/new")}>+</button>
          <h2>Welcome, {user?.username}</h2>
        </div>
        {tasks.length === 0 ? (
          <p>No tasks yet. Click + to create one.</p>
        ) : (
          <TaskList tasks={tasks} syncTasks={syncTasks} />
        )}
      </aside>
      <section className="tasks-detail">
        <Outlet context={{ syncTasks }} />
      </section>
    </div>
  );
}
