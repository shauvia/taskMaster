// import { Link } from "react-router";
// import { useAuth } from "../auth/AuthContext";
import { useEffect, useState } from "react";
import { getTasks } from "../api/apiTasks.js";
import TaskList from "./TaskList.jsx";

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const syncTasks = async () => {
    const allTasks = await getTasks();
    console.log("allTasks", allTasks);
    setTasks(allTasks);
  };

  useEffect(() => {
    syncTasks();
  }, []);

  //   useEffect(() => {
  //     (async () => {
  //       const tasks = await getTasks();
  //       setTasks(tasks);
  //     })();
  //   }, []);

  return (
    <>
      <h2>Tasks</h2>
      <ul>
        {/* {tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))} */}

        <TaskList tasks={tasks} />
      </ul>
    </>
  );
}
