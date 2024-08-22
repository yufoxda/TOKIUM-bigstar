import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import ContentsPage from './pages/ContentsPage';
import HomePage from './pages/HomePage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/contents" element={<ContentsPage/>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
