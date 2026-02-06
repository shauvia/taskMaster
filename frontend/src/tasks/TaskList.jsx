import { Link } from "react-router";
import { useState } from "react";
import { updateTask } from "../api/apiTasks.js";
import { useNavigate } from "react-router";
export default function TaskList({ tasks, syncTasks }) {
  return (
    <ul>
      {tasks.map((task) => (
        // <Link to={`/tasks/${task.id}`}>
        <TaskListItem key={task.id} task={task} syncTasks={syncTasks} />
        // </Link>
      ))}
    </ul>
  );
}

function TaskListItem({ task, syncTasks }) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: task.name,
    description: task.description,
    due_date: task.due_date?.slice(0, 10),
  });

  // updateTask(task, taskId)
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
      let updatedTask = await updateTask(editedTask, task.id);
      console.log("updateTask returned", updatedTask);
      await syncTasks();
      console.log("syncTasks finished");
      setEditing(false);
    } catch (e) {
      setError(e.message);
    }
  };

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
      {/* {error && <p role="alert">{error}</p>} */}
    </form>
  );

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

  return (
    <>
      {editing ? editForm : listItem}
      {error && <p role="alert">{error}</p>}
    </>
  );
}
