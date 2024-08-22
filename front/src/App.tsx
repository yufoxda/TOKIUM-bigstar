import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ContentsPage from './pages/ContentsPage';
import ProtectedRoute from './router/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/contents" : "/login"} />} />
        <Route path="/contents" element={<ProtectedRoute />}>
          <Route index element={<ContentsPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
