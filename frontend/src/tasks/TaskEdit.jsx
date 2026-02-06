import { updateTask, getTask } from "../api/apiTasks.js";
import { useAuth } from "../auth/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

export default function TaskEdit() {
  const { isAuthenticated } = useAuth();
  const { taskId } = useParams();
  console.log("taskId", taskId);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [task, setTask] = useState(null);

  const syncTask = async () => {
    setError(null);
    try {
      let newTask = await getTask(taskId);
      console.log("newTask", newTask);
      setTask(newTask);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    // if (!isAuthenticated) {
    //   navigate("/login");
    // } else {
    //   syncTask();
    // }
    syncTask();
  }, [taskId]);

  //   const tryTaskEdit = async (formData) => {
  //     setError;
  //     try {
  //       const editedTask = {
  //         name: formData.get("taskName"),
  //         description: formData.get("description"),
  //         due_date: formData.get("dueDate"),
  //       };
  //       await updateTask(editedTask, taskId);
  //       //   there should be syncTasks to display updated tasks
  //     } catch (e) {
  //       setError(e.message);
  //     }
  //   };

  //updateTask(task)

  if (!task) return <p>Loading…</p>;

  return (
    // <form action={tryTaskEdit}>
    <form>
      <input type="text" value={task.name} name="name" />
      {/* do I need "onChange={() => {}}" on specific inputs to make changes? */}
      <input type="text" value={task.description} name="description" />
      {/* <input type="datetime-local" value={task.due_date} name="dueDate" /> */}
      <button>Edit</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}

// import { useParams, useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import { getTask, updateTask } from "../api/apiTasks";
// import { useAuth } from "../auth/AuthContext";

// export default function TaskEdit() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { isAuthenticated } = useAuth();

//   const [form, setForm] = useState({ name: "", description: "", due_date: "" });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!isAuthenticated) navigate("/login");
//   }, [isAuthenticated, navigate]);

//   useEffect(() => {
//     let mounted = true;
//     const load = async () => {
//       try {
//         const task = await getTask(id);
//         if (!mounted) return;
//         setForm({
//           name: task.name || "",
//           description: task.description || "",
//           due_date: task.due_date || "",
//         });
//       } catch (err) {
//         setError(err.message || "Failed to load task");
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//     return () => (mounted = false);
//   }, [id]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((s) => ({ ...s, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     try {
//       await updateTask(id, form);
//       if (typeof syncTasks === "function") await syncTasks();
//       navigate("/app/tasks");
//     } catch (err) {
//       setError(err.message || "Update failed");
//     }
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p role="alert">{error}</p>;

//   return (
//     <form onSubmit={handleSubmit}>
//       <input name="name" value={form.name} onChange={handleChange} />
//       <input name="description" value={form.description} onChange={handleChange} />
//       <input name="due_date" type="datetime-local" value={form.due_date} onChange={handleChange} />
//       <button type="submit">Save</button>
//     </form>
//   );
