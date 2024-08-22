import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // フロントのデバッグのために一旦コメントアウト
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" />;
  // } else {
  //   return <Navigate to="/contents" />;
  // }

  return <Outlet />;
};

export default ProtectedRoute;
