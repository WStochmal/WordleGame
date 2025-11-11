// --- lib ---
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// --- pages ---
import WordleGamePage from "./pages/WordleGamePage/WordleGamePage";

// --- style ---
import "@/style/index.scss";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WordleGamePage />} />
      </Routes>
    </Router>
  );
}

export default App;
