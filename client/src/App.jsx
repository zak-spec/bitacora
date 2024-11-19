import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./Pages/LoginPage/LoginPage";
import RegisterPage from "./Pages/RegisterPage/RegisterPage";
import { AuthProvider } from "./Context/AuthContext";
import TasksPage from "./Pages/TasksPage/TasksPage";
import TasksFormPage from "./Pages/TasksFormPage/TasksFormPage";
import Profile from "./Pages/ProfilePage/ProfilePage";
import ProtectedRoute from "./Pages/ProtectedRoute/ProtectedRoute";
import HomePage from "./Pages/HomePage/HomePage";
import { TasksProvider } from "./Context/TasksContex";
import DetailsPage from "./Pages/DetailsPage/DetailsPage";
import AboutPage from "./Pages/AboutPage/AboutPage";
import Header from "./Components/Header/Header";
import Layout from './Components/Layout/Layout';
import SearchPage from "./Pages/SearchPage/SearchPage";
import Collaborator from "./Pages/Collaborator/Collaborator";
import UsersPage from "./Pages/UsersPage/UsersPage";
import CreateUserPage from "./Pages/CreateUserPage/CreateUserPage";

const App = () => {
  return (
    <div className="App">
      <AuthProvider>
        <TasksProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/create-user" element={<CreateUserPage />} />
                <Route path="/About" element={<AboutPage />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/tasks" element={<TasksPage />} />
                  <Route path="/add-task" element={<TasksFormPage />} />
                  <Route path="/tasks/:id" element={<TasksFormPage />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/details/:id" element={<DetailsPage />} />
                  <Route path="/collaborator" element={<Collaborator />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="users" element={<UsersPage/>} />
                </Route>
              </Routes>
            </Layout>
          </Router>
        </TasksProvider>
      </AuthProvider>
    </div>
  );
};

export default App;
