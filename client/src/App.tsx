// --- lib ---
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// --- pages ---
import WordleGamePage from "./pages/WordleGamePage/WordleGamePage";

// --- style ---
import "@/style/index.scss";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<WordleGamePage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
