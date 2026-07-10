import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MouseInfo from "./pages/MouseInfo";
import GripGuide from "./pages/GripGuide";
import MouseSpecs from "./pages/MouseSpecs";
import StartTest from "./pages/StartTest";
import AimTrainer from "./pages/AimTrainer";
import ReactionTime from "./pages/ReactionTime";
import CompareResults from "./pages/CompareResults";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mouse-info" element={<MouseInfo />} />
        <Route path="/grip-guide" element={<GripGuide />} />
        <Route path="/mouse-specs" element={<MouseSpecs />} />
        <Route path="/start-test" element={<StartTest />} />
        <Route path="/aim-trainer" element={<AimTrainer />} />
        <Route path="/reaction-time" element={<ReactionTime />} />
        <Route path="/results" element={<CompareResults />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}