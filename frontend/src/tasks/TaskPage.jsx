// import { Link } from "react-router";
// import { useAuth } from "../auth/AuthContext";
import { useEffect, useState } from "react";
import { getTasks } from "../api/apiTasks.js";
import TaskList from "./TaskList.jsx";

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);
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
    <>
      <h2>Tasks</h2>
      <TaskList tasks={tasks} syncTasks={syncTasks} />
    </>
  );
}
