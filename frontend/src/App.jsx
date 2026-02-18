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
import TaskDetails from "./tasks/TaskDetails.jsx";
import ProjectPage from "./projects/ProjectPage.jsx";
import CreateProject from "./projects/CreateProject.jsx";
import ProjectDetails from "./projects/ProjectDetails.jsx";
import ProjectTaskPage from "./projectTasks/ProjectTaskPage.jsx";
import ProjectTaskDetail from "./projectTasks/ProjectTaskDetail.jsx";
import CreateProjectTask from "./projectTasks/CreateProjectTask.jsx";

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
          <Route path="*" element={<Error404 />} />
          <Route path="/tasks" element={<TaskPage />}>
            <Route path="/tasks/:taskId" element={<TaskDetails />} />
            <Route path="/tasks/new" element={<CreateTask />} />
          </Route>
          <Route path="/projects" element={<ProjectPage />}>
            <Route path="/projects/new" element={<CreateProject />} />
            <Route path="/projects/:projectId" element={<ProjectDetails />}>
              <Route path="tasks/new" element={<CreateProjectTask />} />
              <Route path="tasks/:taskId" element={<ProjectTaskDetail />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}
