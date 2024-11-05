import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import { AuthProvider } from "./Context/AuthContext";

const App = () => {
  return (
    <div>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<h1>Home page</h1>} />
            <Route path="/login" element={<LoginPage/>} />
            <Route path="/register" element={<RegisterPage/>} />
            <Route path="/tasks" element={<h1>Tasks page</h1>} />
            <Route path="/add-task" element={<h1>New task</h1>} />
            <Route path="/tasks/:id" element={<h1>Update task</h1>} />
            <Route path="/profile" element={<h1>Profile</h1>} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
};

export default App;
