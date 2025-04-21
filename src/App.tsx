//роутинг

import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useState } from "react";
import BoardPage from "./pages/BoardPage";
import BoardsListPage from "./pages/BoardsListPage";
import IssuesPage from "./pages/AllIssuesPage";
import Header from "./components/Header";
import TaskForm from "./components/TaskForm";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Router>
      <Header onCreateClick={() => setIsModalOpen(true)} />
      <Routes>
        <Route path="/" element={<Navigate to="/boards" replace />} />
        <Route path="/boards" element={<BoardsListPage />} />
        <Route path="/board/:id" element={<BoardPage />} />
        <Route path="/issues" element={<IssuesPage />} />
      </Routes>

      {isModalOpen && (
        <TaskForm mode="create" onClose={() => setIsModalOpen(false)} />
      )}
    </Router>
  );
}
