import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Arena from "./pages/Arena";
import CreateBrute from "./pages/CreateBrute";
import Fight from "./pages/Fight";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-brute" element={<CreateBrute />} />
        <Route path="/arena" element={<Arena />} />;
        <Route path="/fight" element={<Fight />} />;
      </Routes>
    </Router>
  );
}

export default App;
