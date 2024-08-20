import "./App.css";
import "./index.css";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import SoloTablePage from "./pages/SoloTablePage";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/solo" element={<SoloTablePage />} />
        <Route path="*" element={<>Page not found</>} />
      </Routes>
    </div>
  );
}

export default App;
