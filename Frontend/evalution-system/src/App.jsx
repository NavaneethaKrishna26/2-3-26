import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import EvaluateTeamPage from "./pages/EvaluateTeamPage";
import ViewPerformancePage from "./pages/ViewPerformancePage";
import "./app.css";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<AdminLoginPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/evaluate-team/:teamId" element={<EvaluateTeamPage />} />
        <Route path="/performance" element={<ViewPerformancePage />} />
      </Routes>
    </Router>
  );
}

export default App;
