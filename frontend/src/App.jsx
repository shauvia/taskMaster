import { Routes, Route } from "react-router";
// import BooksPage from "./books/BooksPage";
import Layout from "./layout/Layout";
// import BookDetails from "./books/BookDetails";
import Register from "./auth/Register";
import Login from "./auth/Login";
import Account from "./account/Account.jsx";
import Error404 from "../Error404";
import { Navigate } from "react-router";
import Home from "./homepage/homepage.jsx";
import TaskPage from "./tasks/TaskPage.jsx";
import CreateTask from "./tasks/CreateTask.jsx";

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/homepage" replace />} />
          <Route path="/homepage" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<Account />} />
          <Route path="/tasks" element={<TaskPage />} />
          <Route path="/createTask" element={<CreateTask />} />
          <Route path="*" element={<Error404 />} />
        </Route>
      </Routes>
    </>
  );
}
