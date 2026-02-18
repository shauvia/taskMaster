import { useState, useEffect } from "react";
import { getTask } from "../api/apiTasks.js";
import { updateTask } from "../api/apiTasks.js";
import { useParams, useOutletContext, useNavigate } from "react-router";
import { deleteTask } from "../api/apiTasks.js";

export default function TaskDetails() {
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const { syncTasks } = useOutletContext();
  const { taskId } = useParams();
  const navigate = useNavigate();

  let task;
  const syncTask = async () => {
    task = await getTask(taskId);
    setForm({
      name: task.name,
      description: task.description,
      due_date: task.due_date?.slice(0, 10),
    });
  };

  const handleDelete = async () => {
    setError(null);
    try {
      await deleteTask(taskId);
      await syncTasks();
      navigate("/account");
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    syncTask();
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
      };
      let updatedTask = await updateTask(editedTask, taskId);
      console.log("updateTask returned", updatedTask);
      await syncTasks();
      setEditing(false);
    } catch (e) {
      setError(e.message);
    }
  };

  const listItem = (
    <div className="task-detail-view">
      <h3>{form.name}</h3>
      <p>{form.description}</p>
      <p>
        {form.due_date
          ? new Date(form.due_date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "No due date"}
      </p>
      <button
        onClick={() => {
          setEditing(true);
        }}
      >
        Edit
      </button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );

  const editForm = (
    <form onSubmit={tryTaskEdit}>
      <input
        value={form.name}
        name="name"
        placeholder="Task name"
        onChange={handleChange}
        required
      />

      <input
        value={form.description}
        placeholder="Brief description"
        name="description"
        onChange={handleChange}
      />
      <input
        type="date"
        value={form.due_date}
        name="due_date"
        onChange={handleChange}
      />
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
