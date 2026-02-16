import { useState, useEffect } from "react";
import { getTask } from "../api/apiTasks.js";
import { useParams, useOutletContext } from "react-router";
import { updateProjectTask } from "../api/apiProjects.js";
import { getAllUsers } from "../api/apiUsers.js";

export default function ProjectTaskDetails() {
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const { syncProjectTasks } = useOutletContext();
  const [allUsers, setAllUsers] = useState([]);
  const { projectId, taskId } = useParams();

  let task;
  const syncThisTask = async () => {
    task = await getTask(taskId);
    console.log("ProjectTaskDetails, task", task);
    setForm({
      name: task.name,
      description: task.description,
      due_date: task.due_date?.slice(0, 10),
      assignee_id: task.assignee_id,
    });
  };

  useEffect(() => {
    const loadUsers = async () => {
      const users = await getAllUsers();
      setAllUsers(users);
    };
    loadUsers();
  }, [projectId]);

  useEffect(() => {
    syncThisTask();
  }, [taskId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const tryTaskEdit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const editedTask = {
        name: form.name,
        description: form.description,
        due_date: form.due_date,
        assignee_id: form.assignee_id,
      };
      let updatedTask = await updateProjectTask(editedTask, projectId, taskId);
      await syncProjectTasks();
      setEditing(false);
    } catch (e) {
      setError(e.message);
    }
  };

  const listItem = (
    <div className="task-detail-view">
      <h3>{form.name}</h3>
      <p>{form.description}</p>
      <p>{form.due_date}</p>
      <p>User {form.assignee_id}</p>
      <button
        onClick={() => {
          setEditing(true);
        }}
      >
        Edit
      </button>
    </div>
  );

  const editForm = (
    <form onSubmit={tryTaskEdit}>
      <input value={form.name} name="name" onChange={handleChange} />

      <input
        value={form.description}
        name="description"
        onChange={handleChange}
      />
      <input
        type="date"
        value={form.due_date}
        name="due_date"
        onChange={handleChange}
      />

      <label>
        Pick a collaborator
        <select
          name="assignee_id"
          value={form.assignee_id}
          onChange={handleChange}
        >
          {allUsers.map((user) => (
            <option key={user.id} value={String(user.id)}>
              {user.username}
            </option>
          ))}
        </select>
      </label>
      <button>Save</button>
      <button
        onClick={() => {
          setEditing(false);
        }}
      >
        Cancel
      </button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
  return <>{editing ? editForm : listItem}</>;
}
