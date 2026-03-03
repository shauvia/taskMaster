import { useParams } from "react-router";
import { getTaskByIdAndMemberId } from "../api/apiTasks.js";
import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext.jsx";

export default function ParticipantTaskDetail() {
  const { taskId } = useParams();
  const { user } = useAuth();

  const [task, setTask] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      if (!user?.id) return;
      const taskData = await getTaskByIdAndMemberId(taskId, user.id);
      setTask(taskData);
    };
    fetchTask();
  }, [taskId, user?.id]);

  if (!task) return <p>Loading...</p>;

  return (
    <div className="task-detail-view">
      <h3>{task.name}</h3>
      <p>{task.description}</p>
      <p>
        {task.due_date
          ? new Date(task.due_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "No due date"}
      </p>
    </div>
  );
}
