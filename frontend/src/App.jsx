import { Routes, Route } from "react-router";
import Layout from "./layout/Layout";
import Register from "./auth/Register";
import Login from "./auth/Login";
import Account from "./account/Account.jsx";
import Error404 from "../Error404";
import { Navigate } from "react-router";
import Home from "./homepage/homepage.jsx";
import TaskPage from "./tasks/TaskPage.jsx";
import CreateTask from "./tasks/CreateTask.jsx";
import TaskEdit from "./tasks/TaskEdit.jsx";

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="homepage" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<Account />} />
          <Route path="/tasks" element={<TaskPage />} />
          <Route path="/createTask" element={<CreateTask />} />
          <Route path="/tasks/:taskId" element={<TaskEdit />} />
          <Route path="*" element={<Error404 />} />
        </Route>
      </Routes>
    </>
  );
}
