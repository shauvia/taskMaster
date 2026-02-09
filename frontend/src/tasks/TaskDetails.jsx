import { useState, useEffect } from "react";
import { getTask } from "../api/apiTasks.js";
import { updateTask } from "../api/apiTasks.js";
import { useParams, useOutletContext } from "react-router";

export default function TaskDetails() {
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const { syncTasks } = useOutletContext();
  const { taskId } = useParams();
  let task;
  const syncTask = async () => {
    task = await getTask(taskId);
    setForm({
      name: task.name,
      description: task.description,
      due_date: task.due_date?.slice(0, 10),
    });
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
      console.log("editedTask", editedTask);
      let updatedTask = await updateTask(editedTask, taskId);
      console.log("updateTask returned", updatedTask);
      await syncTasks();
      console.log("syncTasks finished");
      setEditing(false);
    } catch (e) {
      setError(e.message);
    }
  };

  const listItem = (
    <li>
      <h3>{form.name}</h3>
      <p>{form.description}</p>
      <p>{form.due_date}</p>
      <button
        onClick={() => {
          setEditing(true);
        }}
      >
        Edit
      </button>
    </li>
  );

  const editForm = (
    // <form action={tryTaskEdit}>
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
      <button>Edit</button>
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
