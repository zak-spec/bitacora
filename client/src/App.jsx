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
import Homepage from "./Pages/HomePage/HomePage";
import { TasksProvider } from "./Context/TasksContex";

const App = () => {
  return (
    <AuthProvider>
      <TasksProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Homepage/>} />
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/register" element={<RegisterPage/>} />
            
            <Route element={<ProtectedRoute/>}> 
            <Route path="/tasks" element={<TasksPage/>} />
            <Route path="/add-task" element={<TasksFormPage/>} />
            <Route path="/tasks/:id" element={<TasksFormPage/>} />
            <Route path="/profile" element={<Profile/>} /> 
            </Route>
          </Routes>
        </Router>
      </TasksProvider>
    </AuthProvider>
  );
};

export default App;
